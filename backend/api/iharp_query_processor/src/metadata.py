import numpy as np
import pandas as pd
import xarray as xr

from src.utils.const import DataRange, get_lat_lon_range, time_resolution_to_freq
from src.query_monitor import update_storage_used

_f_path = ""
_df_meta: pd.DataFrame

def init_metadata(f_path):
    global _f_path, _df_meta
    _f_path = f_path
    _df_meta = pd.read_csv(f_path)
    update_storage_used(set(_df_meta["file_path"]))

def _gen_empty_xarray(
    min_lat,
    max_lat,
    min_lon,
    max_lon,
    start_datetime,
    end_datetime,
    temporal_resolution,
    spatial_resolution,
    dataset,
):
    lat_range, lon_range, lat_range_reverse = get_lat_lon_range(spatial_resolution, dataset)
    lat_start = lat_range.searchsorted(min_lat, side="left")
    lat_end = lat_range.searchsorted(max_lat, side="right")
    lat_reverse_start = len(lat_range) - lat_end
    lat_reverse_end = len(lat_range) - lat_start
    lon_start = lon_range.searchsorted(min_lon, side="left")
    lon_end = lon_range.searchsorted(max_lon, side="right")
    ds_empty = xr.Dataset()
    ds_empty["time"] = pd.date_range(
        start=start_datetime,
        end=end_datetime,
        freq=time_resolution_to_freq(temporal_resolution),
    )
    ds_empty["latitude"] = lat_range_reverse[lat_reverse_start:lat_reverse_end]
    ds_empty["longitude"] = lon_range[lon_start:lon_end]
    return ds_empty

def _gen_xarray_for_meta_row(row, overwrite_temporal_resolution=None):
    if overwrite_temporal_resolution is not None:
        t_resolution = overwrite_temporal_resolution
    else:
        t_resolution = row.temporal_resolution
    return _gen_empty_xarray(
        row.min_lat,
        row.max_lat,
        row.min_lon,
        row.max_lon,
        row.start_datetime,
        row.end_datetime,
        t_resolution,
        row.spatial_resolution,
        row.dataset,
    )

def _mask_query_with_meta(ds_query, ds_meta):
    return (
        ds_query["time"].isin(ds_meta["time"])
        & ds_query["latitude"].isin(ds_meta["latitude"])
        & ds_query["longitude"].isin(ds_meta["longitude"])
    )

# TODO: convert precision level better, ideally in a way where you can change how levels are defined easily
def _precision_level_to_resolutions(precision_level: int):
    if precision_level <= 1:
        return {"temporal_resolution": "year", "spatial_resolution": 1.0}
    elif precision_level == 2:
        return {"temporal_resolution": "month", "spatial_resolution": 0.5}
    elif precision_level == 3:
        return {"temporal_resolution": "day", "spatial_resolution": 0.25}
    else: # precision_level == 4
        return {"temporal_resolution": "hour", "spatial_resolution": 0.25}

def _resolutions_to_precision_level(temporal_resolution: str, spatial_resolution: float):
    if temporal_resolution == "hour":
        return 4
    elif temporal_resolution == "day" or spatial_resolution <= 0.25:
        return 3
    elif temporal_resolution == "month" or spatial_resolution <= 0.5:
        return 2
    else:
        return 1

# Adds metadata for a given DataRange
def add_metadata(dr: DataRange, file: str):
    precision = _resolutions_to_precision_level(dr.temporal_resolution, dr.spatial_resolution)
    _df_meta = pd.concat(_df_meta, pd.DataFrame({
        "variable": dr.variable, 
        "min_lat": dr.min_lat,
        "max_lat": dr.max_lat,
        "min_lon": dr.min_lon,
        "max_lon": dr.max_lon,
        "start_datetime": dr.start_datetime,
        "end_datetime": dr.end_datetime,
        "file_path": file,
        "precision_level": precision,
        "aggregation":dr.aggregation
        }))

# Removes metadata down to and including a given DataRange
def remove_metadata(dr: DataRange):
    precision = _resolutions_to_precision_level(dr.temporal_resolution, dr.spatial_resolution)
    _df_meta = _df_meta[
        (_df_meta["variable"] != dr.variable)
        | (_df_meta["min_lat"] >= dr.max_lat)
        | (_df_meta["max_lat"] <= dr.min_lat)
        | (_df_meta["min_lon"] >= dr.max_lon)
        | (_df_meta["max_lon"] <= dr.min_lon)
        | (pd.to_datetime(_df_meta["start_datetime"]) >= pd.to_datetime(dr.end_datetime))
        | (pd.to_datetime(_df_meta["end_datetime"]) <= pd.to_datetime(dr.start_datetime))
        | (_df_meta["precision_level"] < precision)
        | (_df_meta["aggregation"] not in [dr.aggregation, "none"])
    ]

# Removes metadata surrounding a specific file
def remove_metadata(filepath: str):
    _df_meta = _df_meta[
        (_df_meta["file_path"] != filepath)
    ]

# Returns a set of all the "largest" (highest precision level) files in the DB
# Used in query monitor - we only want to consider deleting these
def get_largest_files() -> set[str]:
    largest = _df_meta.groupby(["variable", "min_lat", "max_lat", "min_lon", "max_lon", "start_datetime", "end_datetime"])
    largest = largest["precision_level"].transform(max) == _df_meta["precision_level"]

    return set(_df_meta[largest]["file_path"])

def query_get_overlap_and_leftover(dr: DataRange):
    precision = _resolutions_to_precision_level(dr.temporal_resolution, dr.spatial_resolution)
    df_overlap = _df_meta[
        (_df_meta["variable"] == dr.variable)
        & (_df_meta["min_lat"] <= dr.max_lat)
        & (_df_meta["max_lat"] >= dr.min_lat)
        & (_df_meta["min_lon"] <= dr.max_lon)
        & (_df_meta["max_lon"] >= dr.min_lon)
        & (pd.to_datetime(_df_meta["start_datetime"]) <= pd.to_datetime(dr.end_datetime))
        & (pd.to_datetime(_df_meta["end_datetime"]) >= pd.to_datetime(dr.start_datetime))
        & (_df_meta["precision_level"] == precision)
        & (_df_meta["aggregation"] == dr.aggregation)
    ]

    ds_query = _gen_empty_xarray(
        dr.min_lat,
        dr.max_lat,
        dr.min_lon,
        dr.max_lon,
        dr.start_datetime,
        dr.end_datetime,
        precision,
        dr.dataset
    )

    false_mask = xr.DataArray(
        data=np.zeros(
            (
                ds_query.sizes["time"],
                ds_query.sizes["latitude"],
                ds_query.sizes["longitude"],
            ),
            dtype=bool,
        ),
        coords={
            "time": ds_query["time"],
            "latitude": ds_query["latitude"],
            "longitude": ds_query["longitude"],
        },
        dims=["time", "latitude", "longitude"],
    )

    for row in df_overlap.itertuples():
        ds_meta = _gen_xarray_for_meta_row(row)
        mask = _mask_query_with_meta(ds_query, ds_meta)
        false_mask = false_mask | mask

    leftover = false_mask.where(false_mask == False, drop=True)
    if leftover.values.size > 0:
        return df_overlap, leftover
    else:
        return df_overlap, None
