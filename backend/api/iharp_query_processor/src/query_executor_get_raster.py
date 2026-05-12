# import tomli_w
from pathlib import Path
from datetime import datetime
import math
import cdsapi
import pandas as pd
import xarray as xr

from api.iharp_query_processor.src.remote.driver import RequestRemoteData
from api.iharp_query_processor.src.metadata import query_get_overlap_and_leftover
from api.iharp_query_processor.src.query_executor import QueryExecutor
from api.iharp_query_processor.src.utils.const import DataRange, time_resolution_to_freq, DATASET_GRID_DIMS

# def write_toml_config(path, config_dict):
#     with open(path, "wb") as f:
#         tomli_w.dump(config_dict, f)

DATASET_SELECTORS = {
    "ERA5": lambda ds, dr: ds.sel(
        valid_time=slice(dr.start_datetime, dr.end_datetime),
        latitude=slice(dr.max_lat, dr.min_lat),
        longitude=slice(dr.min_lon, dr.max_lon),
    ),

    "CARRA": lambda ds, dr: ds.sel(
        time=slice(dr.start_datetime, dr.end_datetime)
    )
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
        df_overlap, leftover = query_get_overlap_and_leftover(self.dr)

        if df_overlap.empty:
            local_files = []
        else:
            local_files = sorted(df_overlap["file_path"].tolist())

        if leftover:        # TODO: allow multiple leftovers

            requests = []

            for cov in leftover:
                start = cov.time_range[0]
                end = cov.time_range[1]

                years = [str(y) for y in range(start.year, end.year + 1)]
                req = {
                    "dataset": self.dr.dataset,
                    "variable": self.dr.variable,
                    "years": years,
                    # TODO: add months, days
                }

                if self.dr.dataset == "ERA5":
                    req.update({
                        "min_lat": cov.spatial["min_lat"],
                        "max_lat": cov.spatial["max_lat"],
                        "min_lon": cov.spatial["min_lon"],
                        "max_lon": cov.spatial["max_lon"],
                    })
                elif self.dr.dataset == "CARRA":
                    req["domain"] = cov.spatial["domain"]

                requests.append(req)
        else:
            requests = []

        return local_files, requests
    
            # leftover_min_lat = math.floor(leftover.latitude.min().item())
            # leftover_max_lat = math.ceil(leftover.latitude.max().item())
            # leftover_min_lon = math.floor(leftover.longitude.min().item())
            # leftover_max_lon = math.ceil(leftover.longitude.max().item())
            # leftover_start_datetime = pd.Timestamp(leftover.time.min().item())
            # leftover_end_datetime = pd.Timestamp(leftover.time.max().item())
            # leftover_start_year, leftover_start_month, leftover_start_day = (
            #     leftover_start_datetime.year,
            #     leftover_start_datetime.month,
            #     leftover_start_datetime.day,
            # )
            # leftover_end_year, leftover_end_month, leftover_end_day = (
            #     leftover_end_datetime.year,
            #     leftover_end_datetime.month,
            #     leftover_end_datetime.day,
            # )

            # years = [str(i) for i in range(leftover_start_year, leftover_end_year + 1)]
            # months = [str(i).zfill(2) for i in range(1, 13)]
            # days = [str(i).zfill(2) for i in range(1, 32)]
            # if self.dr.temporal_resolution == "month":
            #     if leftover_start_year == leftover_end_year:
            #         months = [str(i).zfill(2) for i in range(leftover_start_month, leftover_end_month + 1)]
            # if self.dr.temporal_resolution == "day" or self.dr.temporal_resolution == "hour":
            #     if leftover_start_year == leftover_end_year:
            #         months = [str(i).zfill(2) for i in range(leftover_start_month, leftover_end_month + 1)]
            #         if leftover_start_month == leftover_end_month:
            #             days = [str(i).zfill(2) for i in range(leftover_start_day, leftover_end_day + 1)]

            # request_params = {
            #     "dataset": self.dr.dataset,
            #     "variable": self.dr.variable,
            #     "years": years,
            #     "months": months,
            #     "days": days,
            #     "min_lat": leftover_min_lat,
            #     "max_lat": leftover_max_lat,
            #     "min_lon": leftover_min_lon,
            #     "max_lon": leftover_max_lon,
            # }
            # # other parameters
            # if self.dr.domain is not None:
            #     request_params["domain"] = self.dr.domain

            # if self.dr.height_level is not None:
            #     request_params["height_level"] = self.dr.height_level

        # else:
        #     request_params = {}
        # return local_files, request_params

    def _gen_download_file_name(self):
        dt = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"download_{dt}.nc"

    def _process_dataset(self, ds):

        # temporal resample
        if self.dr.temporal_resolution != "hour":
            resampled = ds.resample(valid_time=time_resolution_to_freq(self.dr.temporal_resolution))
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
            dims = DATASET_GRID_DIMS[self.dr.dataset]
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

    def execute(self):

        # 1. check local data
        ds_list = []
        local_files, requests = self._data_files_for_query()

        # 2. join local data files
        for file in local_files:

            with xr.open_dataset(file, engine="netcdf4") as ds:
                selector = DATASET_SELECTORS[self.dr.dataset]
                ds = selector(ds, self.dr)

        # 3. if local data cannot answer query, call APIs to download needed data
        for params in requests:
            print(f"params: {params}")
            driver = RequestRemoteData.from_dict(params)
            result = driver.execute()

            if not result.success:
                raise RuntimeError(result.error)
            
            for file in result.files:
                
                with xr.open_dataset(file, engine="netcdf4") as ds:
                    
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