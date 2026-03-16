#######################################
# How to run file:
#
#   edit the data range/parameters if you want
# 
#   run in terminal
#
#       source venv/bin/activate
#       cd /../iharp_query_processor
#       python -m src.test_qe_get_raster
#
#######################################

import pandas as pd
import numpy as np
import xarray as xr
from datetime import datetime

from src.query_executor_get_raster import GetRasterExecutor
from src.query_executor_timeseries import TimeseriesExecutor
from src.utils.const import DataRange
import src.query_executor_get_raster as raster_module
from src.remote.era5 import ERA5Repository

import sys
import os

print("PYTHONPATH:", sys.path)
print("CWD:", os.getcwd())

def mock_query_get_overlap_and_leftover(dr):

    print("\n===== MOCK query_get_overlap_and_leftover CALLED =====")
    print("Incoming DataRange:", dr)

    # simulate one local file
    local_file = "mock_local.nc"

    times = pd.date_range("2024-01-01", periods=24, freq="h")
    lat = np.linspace(dr.min_lat, dr.max_lat, 5)
    lon = np.linspace(dr.min_lon, dr.max_lon, 5)

    data = np.random.rand(len(times), len(lat), len(lon))

    ds = xr.Dataset(
        {"t2m": (["valid_time", "latitude", "longitude"], data)},
        coords={
            "valid_time": times,
            "latitude": lat,
            "longitude": lon,
        },
    )

    ds.to_netcdf(local_file)

    df_overlap = pd.DataFrame({
        "file_path": [local_file]
    })

    # simulate leftover requiring download
    leftover = xr.Dataset(
        coords={
            "latitude": np.array([dr.min_lat, dr.max_lat]),
            "longitude": np.array([dr.min_lon, dr.max_lon]),
            "time": pd.date_range(dr.start_datetime, dr.end_datetime)
        }
    )

    print("Mock returning:")
    print("Local files:", df_overlap["file_path"].tolist())
    print("Leftover present")

    return df_overlap, leftover

def fake_download(self):

    print("FAKE DOWNLOAD CALLED")

    downloaded_file = "downloaded_file.nc"

    times = pd.date_range("2024-01-02", periods=24, freq="h")
    lat = np.linspace(dr.min_lat, dr.max_lat, 5)
    lon = np.linspace(dr.min_lon, dr.max_lon, 5)

    data = np.random.rand(len(times), len(lat), len(lon))

    ds = xr.Dataset(
        {"t2m": (["valid_time", "latitude", "longitude"], data)},
        coords={
            "valid_time": times,
            "latitude": lat,
            "longitude": lon,
        },
    )

    ds.to_netcdf(downloaded_file)

    return [downloaded_file]

dr = DataRange(
    dataset="carra",
    variable="temperature",

    start_datetime=datetime(2020,2,1),
    end_datetime=datetime(2020,2,28),

    min_lat=65,
    max_lat=85,
    min_lon=15,
    max_lon=70,

    temporal_resolution="hour",
    spatial_resolution=0.25,
    aggregation="mean",

    domain="east_domain",
    height_level="15_m",
)

print("\n===== TEST DATARANGE =====")
print(dr)


### CALL

download = True


# injecting mock function for testing
raster_module.query_get_overlap_and_leftover = mock_query_get_overlap_and_leftover


if not download:
    # injecting mock function for testing
    ERA5Repository.download = fake_download

executor = TimeseriesExecutor(
    dr=dr,
    time_series_aggregation_method="mean"
)

result = executor.execute()

print("\nRESULT:")
print(result)