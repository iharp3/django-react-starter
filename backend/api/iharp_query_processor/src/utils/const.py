import numpy as np
import xarray as xr
from dataclasses import dataclass
from typing import override, Optional, List
from numpy import dtype, nan

DATASET_GRID_DIMS = {
    "ERA5": {
        "x": "longitude",
        "y": "latitude",
        "time": "valid_time",
    },
    "CARRA": {
        "x": "x",
        "y": "y",
        "time": "time",
    }
}

long_short_name_dict = {
    "2m_temperature": "t2m",        # ERA5 single level variable
    "snow_depth": "sd",             # ERA5 single level variable
    "snowfall": "sf",               # ERA5 single level variable
    "snowmelt": "smlt",             # ERA5 single level variable
    "surface_pressure": "sp",               # ERA5 single level variable
    "sea_surface_temperature": "sst",               # ERA5 single level variable
    "temperature_of_snow_layer": "tsn",             # ERA5 single level variable
    "total_precipitation": "tp",                # ERA5 single level variable
    "ice_temperature_layer_1": "istl1",             # ERA5 single level variable
    "ice_temperature_layer_2": "istl2",             # ERA5 single level variable
    "ice_temperature_layer_3": "istl3",             # ERA5 single level variable
    "ice_temperature_layer_4": "istl4",             # ERA5 single level variable
    "temperature": "t",     # CARRA height level variable
    "pressure": "pres",     # CARRA height level variable
    "relative_humidity":"r",        # CARRA height level variable
    "specific_cloud_ice_water_content":"ciwc",      # CARRA height level variable
    "specific_cloud_liquid_water_content":"clwc",       # CARRA height level variable
    "wind_direction":"wdir",         # CARRA height level variable
    "wind_speed":"ws",       # CARRA height level variable
}

encodings = {
    "era5": {"dtype": dtype("float32"), "zlib": True, "_FillValue": np.float32(nan), "complevel": 1},
    "carra_e": {"dtype": dtype("float32"), "zlib": True, "_FillValue": np.float32(nan), "complevel": 1},
    "carra_w": {"dtype": dtype("float32"), "zlib": True, "_FillValue": np.float32(nan), "complevel": 1}
}

@dataclass
class DataRange:
    """A class to represent a chunk of data, including variable, aggregation, and resolutions"""
    dataset: str
    variable: str
    start_datetime: str
    end_datetime: str
    min_lat: Optional[float] = None
    max_lat: Optional[float] = None
    min_lon: Optional[float] = None
    max_lon: Optional[float] = None
    temporal_resolution: str = "month"  # e.g., "hour", "day", "month", "year"
    spatial_resolution: float = 0.5# e.g., 0.25, 0.5, 1.0
    aggregation: str = "mean"# e.g., "mean", "max", "min"
    domain: Optional[str] = None
    height_level: Optional[str] = None

    @override
    def __copy__(self):
        return DataRange(
            dataset=self.dataset,
            variable=self.variable,
            start_datetime=self.start_datetime,
            end_datetime=self.end_datetime,
            min_lat=self.min_lat,
            max_lat=self.max_lat,
            min_lon=self.min_lon,
            max_lon=self.max_lon,
            temporal_resolution=self.temporal_resolution,
            spatial_resolution=self.spatial_resolution,
            aggregation=self.aggregation,
            domain=self.domain,
            height_level=self.height_level)

# TODO: can we change np.arange to params for it so we only have one np.arange?
e_dims = np.load("/data/carra/carra_east_grid.npz")
w_dims = np.load("/data/carra/carra_west_grid.npz")
dat_range_and_res = {
    "era5": {   
                "lat":np.arange(-90,90.1,0.25),
                "lon":np.arange(-180,180.1,0.25)},
    "carra_e": {
                "lat":e_dims['lat'],
                "lon": e_dims['lon']},
    "carra_w": {
                "lat":w_dims['lat'],
                "lon": w_dims['lon']},
}

# TODO: NEED TO REWRITE FOR DIFFERENT DATASETS
def make_empty_datasets(dataset, domain):
    if dataset == "CARRA":
        if domain == "West":
            dat = "carra_w"
        elif domain == "East":
            dat = "carra_e"
    # TODO: make this general - decide on capital letters/abv. for datasets/domains
    else:
        dat = "era5"

    ds_raw = xr.Dataset()
    ds_raw["latitude"] = dat_range_and_res[dat]["lat"]
    ds_raw["longitude"] = dat_range_and_res[dat]["lon"]
    ds_05 = ds_raw.coarsen(latitude=2, longitude=2, boundary="trim").max()
    ds_10 = ds_raw.coarsen(latitude=4, longitude=4, boundary="trim").max()

    return ds_raw, ds_05, ds_10

# TODO: make it so only the necessary coarsening is done instead of all of them
def get_lat_lon_range(spatial_resolution, dataset, domain):
    ds_raw, ds_05, ds_10 = make_empty_datasets(dataset, domain)
    if spatial_resolution == 0.25:
        lat_range = ds_raw.latitude.values
        lon_range = ds_raw.longitude.values
    elif spatial_resolution == 0.5:
        lat_range = ds_05.latitude.values
        lon_range = ds_05.longitude.values
    elif spatial_resolution == 1.0:
        lat_range = ds_10.latitude.values
        lon_range = ds_10.longitude.values
    else:
        raise ValueError("Invalid spatial_resolution")
    return lat_range, lon_range, lat_range[::-1]


def time_resolution_to_freq(time_resolution):
    if time_resolution == "hour":
        return "h"
    elif time_resolution == "day":
        return "D"
    elif time_resolution == "month":
        return "ME"
    elif time_resolution == "year":
        return "YE"
    else:
        raise ValueError("Invalid time_resolution")
    
def find_lat_lon_dims(ds):
    lat_candidates = ["latitude", "lat", "y"]
    lon_candidates = ["longitude", "lon", "long", "x"]

    lat_dim = None
    lon_dim = None

    # Check dimensions first
    for dim in ds.dims:
        d = dim.lower()
        if d in lat_candidates:
            lat_dim = dim
        elif d in lon_candidates:
            lon_dim = dim

    # Fallback: check coordinates if not found in dims
    if lat_dim is None:
        for coord in ds.coords:
            if coord.lower() in lat_candidates:
                lat_dim = coord

    if lon_dim is None:
        for coord in ds.coords:
            if coord.lower() in lon_candidates:
                lon_dim = coord

    if lat_dim is None or lon_dim is None:
        raise ValueError("Could not find latitude/longitude dimensions")

    return lat_dim, lon_dim
