import numpy as np
import xarray as xr
from dataclasses import dataclass
from typing import override, Optional, List
from numpy import dtype, nan

long_short_name_dict = {
    "2m_temperature": "t2m",
    "snow_depth": "sd",
    "snowfall": "sf",
    "snowmelt": "smlt",
    "surface_pressure": "sp",
    "sea_surface_temperature": "sst",
    "temperature_of_snow_layer": "tsn",
    "total_precipitation": "tp",
    "ice_temperature_layer_1": "istl1",
    "ice_temperature_layer_2": "istl2",
    "ice_temperature_layer_3": "istl3",
    "ice_temperature_layer_4": "istl4",
    "temperature": "temperature",
    "pressure": "pressure",
    "relative_humidity":"relative_humidity",
    "specific_cloud_ice_water_content":"specific_cloud_ice_water_content",
    "specific_cloud_liquid_water_content":"specific_cloud_liquid_water_content",
    "wind_direction":"wind_direction",
    "wind_speed":"wind_speed",
}

encodings = {
    "era5": {"dtype": dtype("float32"), "zlib": True, "_FillValue": np.float32(nan), "complevel": 1}
}

@dataclass
class DataRange:
    """A class to represent a chunk of data, including variable, aggregation, and resolutions"""
    dataset: str
    variable: str
    start_datetime: str
    end_datetime: str
    min_lat: float
    max_lat: float
    min_lon: float
    max_lon: float
    temporal_resolution: str  # e.g., "hour", "day", "month", "year"
    spatial_resolution: float # e.g., 0.25, 0.5, 1.0
    aggregation: str # e.g., "mean", "max", "min"

    # Optional fields
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
dat_range_and_res = {
    "era5": {   
                "lat":np.arange(-90,90.1,0.25),
                "lon":np.arange(-180,180.1,0.25)},

    # TODO: figure out carra ranges for lat/lon for get_lat_lon_range function to use
    #           save in .npz file, then load in with dims=np.load(file.npz) and then lat = dims['lat'] etc.
    "carra": {
                "lat":np.arange(),
                "lon": np.arange()},
}

# TODO: NEED TO REWRITE FOR DIFFERENT DATASETS
def make_empty_datasets(dataset):
    ds_raw = xr.Dataset()

    ds_raw["latitude"] = dat_range_and_res[dataset]["lat"]
    ds_raw["longitude"] = dat_range_and_res[dataset]["lon"]
    ds_05 = ds_raw.coarsen(latitude=2, longitude=2, boundary="trim").max()
    ds_10 = ds_raw.coarsen(latitude=4, longitude=4, boundary="trim").max()

    return ds_raw, ds_05, ds_10

def get_lat_lon_range(spatial_resolution, dataset):
    ds_raw, ds_05, ds_10 = make_empty_datasets(dataset)
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
