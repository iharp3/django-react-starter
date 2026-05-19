# import tomli_w
from pathlib import Path
from datetime import datetime
import math
import cdsapi
import pandas as pd
import xarray as xr
import numpy as np

import logging

from api.iharp_query_processor.src.remote.driver import RequestRemoteData
from api.iharp_query_processor.src.metadata import query_get_overlap_and_leftover
from api.iharp_query_processor.src.query_executor import QueryExecutor
from api.iharp_query_processor.src.utils.const import DataRange, time_resolution_to_freq, DATASET_GRID_DIMS, CARRA_COORDINATES

def _carra_time_selector(ds, dr):
    print(f"[_carra_time_selector] Dataset coords: {list(ds.coords)}, dims: {list(ds.dims)}")
    for time_dim in ("valid_time", "time"):
        if time_dim in ds.coords or time_dim in ds.dims:
            print(f"[_carra_time_selector] Found time dim: {time_dim}")
            return ds.sel({time_dim: slice(dr.start_datetime, dr.end_datetime)})
    raise ValueError(f"CARRA dataset has no recognized time coordinate. Available coords: {list(ds.coords)}, dims: {list(ds.dims)}")

def _select_carra(ds, dr):
    print(f"[_select_carra] Called with domain={dr.domain}")
    print(f"[_select_carra] Full dataset before time selection: coords={list(ds.coords)}, dims={list(ds.dims)}")
    
    sel = _carra_time_selector(ds, dr)
    print(f"[_select_carra] After time selection, coords: {list(sel.coords)}, dims: {list(sel.dims)}")
    
    domain = getattr(dr, "domain", None)
    if domain is None:
        raise ValueError("CARRA queries require a domain value")

    # Try direct domain coordinate
    if "domain" in sel.coords:
        print(f"[_select_carra] Found 'domain' coord with values: {sel.coords['domain'].values}")
        print(f"[_select_carra] Trying to select domain={domain}")
        try:
            result = sel.sel(domain=domain)
            print(f"[_select_carra] Success! Result shape: {result.sizes}")
            # return result
        except Exception as e:
            print(f"[_select_carra] Failed to select 'domain'={domain}: {e}")

    # If no domain coordinate exists, just return the time-selected data
    print(f"[_select_carra] WARNING: No domain coordinate found. Returning full time-selected dataset.")
    print(f"[_select_carra] Available coords: {list(sel.coords)}")
    return sel

DATASET_SELECTORS = {
    "ERA5": lambda ds, dr: ds.sel(
        valid_time=slice(dr.start_datetime, dr.end_datetime),
        latitude=slice(dr.max_lat, dr.min_lat),
        longitude=slice(dr.min_lon, dr.max_lon),
    ),

    "CARRA": _select_carra,
    
}


class GetRasterExecutor(QueryExecutor):
    def __init__(
        self,
        dr: DataRange,
        log_info=None,
    ):
        super().__init__(
            dr,
        )
        self.log_info = log_info if log_info is not None else []

    def get_log(self):
        return self.log_info
    
    def _data_files_for_query(self):

        # TODO: check if you utilize lower resolution files
        df_overlap, remaining_regions = query_get_overlap_and_leftover(self.dr)

        #
        # local files already available
        #
        if df_overlap.empty:
            local_files = []
        else:
            local_files = sorted(
                df_overlap["file_path"]
                .dropna()
                .unique()
                .tolist()
            )

        # 
        # no missing coverage
        #
        if not remaining_regions:
            return local_files, []
        
        #
        # build requests for uncovered regions
        #
        requests = []

        for region in remaining_regions:
            print(f"DATA NOT IN LOCAL FILES: {region.dataset}, {region.variable}, {region.start}, {region.end}, {region.spatial}")
            # TODO: add limit for size of data to download, offline downloading, etc.
            # continue
            # 
            # half-open interval [start, end)
            # 
            start = pd.Timestamp(region.start)
            end = pd.Timestamp(region.end)

            if start >= end:    # invalid region
                continue

            #
            # years needed
            #
            years = [str(y) for y in range(start.year, end.year + 1)]
            req = {
                "dataset": region.dataset,
                "variable": region.variable,
                "years": years,
                "start_datetime": start.isoformat(),
                "end_datetime": end.isoformat(),
            }

            #
            # dataset-specific spatial request
            #
            if region.dataset == "ERA5":
                req.update(
                    {
                        "min_lat": region.spatial["min_lat"],
                        "max_lat": region.spatial["max_lat"],
                        "min_lon": region.spatial["min_lon"],
                        "max_lon": region.spatial["max_lon"], 
                    }
                )
            elif region.dataset == "CARRA":
                req.update(
                    {
                        "domain": region.spatial["domain"],
                    }
                )
                if getattr(self.dr, "height_level", None) is not None:
                    req["height_level"] = self.dr.height_level
            # else:
            #     req.update(
            #         {
            #             "min_lat": region.spatial["min_lat"],
            #             "max_lat": region.spatial["max_lat"],
            #             "min_lon": region.spatial["min_lon"],
            #             "max_lon": region.spatial["max_lon"], 
            #         }
            #     )
            else:
                raise ValueError(
                    f"Unsupported dataset: {region.dataset}" 
                )
            
            requests.append(req)

        print(f"local_files: {local_files}")
        return local_files, requests
    
    def _gen_download_file_name(self):
        dt = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"download_{dt}.nc"

    def _process_dataset(self, ds):

        dims = DATASET_GRID_DIMS[self.dr.dataset]

        # temporal resample
        if self.dr.temporal_resolution != "hour":
            resampled = ds.resample(
                {dims["time"]: time_resolution_to_freq(self.dr.temporal_resolution)}
            )
            if self.dr.aggregation == "mean":
                ds = resampled.mean()
            elif self.dr.aggregation == "max":
                ds = resampled.max()
            elif self.dr.aggregation == "min":
                ds = resampled.min()
            else:
                raise ValueError("Invalid temporal_aggregation")
        # spatial resample
        if self.dr.spatial_resolution > 0.25:
            c_f = int(self.dr.spatial_resolution / 0.25)
            coarsened = ds.coarsen(
                {
                    dims["y"]: c_f,
                    dims["x"]: c_f,
                },
                boundary="trim"
            )
            if self.dr.aggregation == "mean":
                ds = coarsened.mean()
            elif self.dr.aggregation == "max":
                ds = coarsened.max()
            elif self.dr.aggregation == "min":
                ds = coarsened.min()
            else:
                raise ValueError("Invalid spatial_aggregation")

        return ds
    
    def execute(self):

        # 1. check local data
        ds_list = []
        local_files, requests = self._data_files_for_query()

        # 2. join local data files
        for file in local_files:

            ds = xr.open_dataset(file, engine="netcdf4")
            selector = DATASET_SELECTORS[self.dr.dataset]
            ds = selector(ds, self.dr)
            ds_list.append(ds)

        # 3. if local data cannot answer query, call APIs to download needed data
        for params in requests:
            print(f"params: {params}")
            driver = RequestRemoteData.from_dict(params)
            result = driver.execute()

            if not result.success:
                raise RuntimeError(result.error)
            
            for file in result.files:
                
                ds = xr.open_dataset(file, engine="netcdf4")
                ds = self._process_dataset(ds)
                ds_list.append(ds)

        if not ds_list:
            raise RuntimeError("No data found locally or remotely")

        # 5. assemble result
        try:
            ds = xr.merge([i.chunk() for i in ds_list], compat="no_conflicts", join="outer")
        except ValueError:
            print("WARNING: conflict in merging data, use override")
            ds = xr.merge([i.chunk() for i in ds_list], compat="override", join="outer")

        return ds.compute()