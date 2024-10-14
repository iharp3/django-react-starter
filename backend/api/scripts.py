import xarray as xr


def slice_raster(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    time_resolution: str,  # e.g., "hour", "day", "month", "year"
    time_agg_method: str,  # e.g., "mean", "max", "min"
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
):

    file_path = "./api/aweek.nc"
    ds = xr.open_dataset(file_path, engine="netcdf4").sel(
        time=slice(start_datetime, end_datetime),
        latitude=slice(max_lat, min_lat),
        longitude=slice(min_lon, max_lon),
    )
    return ds


def ret_html(
    # variable: str,
    start_datetime: str,
    end_datetime: str,
    # time_resolution: str,  # e.g., "hour", "day", "month", "year"
    # time_agg_method: str,  # e.g., "mean", "max", "min"
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
):
    ds = slice_raster(
        variable="2m_temperature",
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        time_resolution="hour",
        time_agg_method="mean",
        min_lat=min_lat,
        max_lat=max_lat,
        min_lon=min_lon,
        max_lon=max_lon,
    )

    return ds._repr_html_()