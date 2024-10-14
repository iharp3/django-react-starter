import xarray as xr
import pandas as pd
import calendar
import numpy as np


RAW_DATA_PATH = "/data/era5/raw"
AGG_DATA_PATH = "/data/era5/agg/"

long_short_name_dict = {
    "2m_temperature": "t2m",
}



def get_last_date_of_month(dt):
    return calendar.monthrange(dt.year, dt.month)[1]


def get_whole_year_between(start_dt, end_dt):
    assert start_dt.year <= end_dt.year
    start_year = start_dt.year
    end_year = end_dt.year
    first_hour_start_year = pd.Timestamp(f"{start_year}-01-01 00:00:00")
    last_hour_end_year = pd.Timestamp(f"{end_year}-12-31 23:00:00")
    years = list(range(start_year, end_year + 1))
    if start_dt != first_hour_start_year:
        years = years[1:]
    if end_dt != last_hour_end_year:
        years = years[:-1]
    # residual
    residual = []
    last_hour_start_year = pd.Timestamp(f"{start_year}-12-31 23:00:00")
    first_hour_end_year = pd.Timestamp(f"{end_year}-01-01 00:00:00")
    if end_dt <= last_hour_start_year:
        residual.append([start_dt, end_dt])
    else:
        if start_dt != first_hour_start_year:
            residual.append([start_dt, last_hour_start_year])
        if end_dt < last_hour_end_year:
            residual.append([first_hour_end_year, end_dt])
    # print("years:", years)
    # print("month residual:", residual)
    return years, residual


def get_whole_month_between(start_dt, end_dt):
    assert start_dt.year == end_dt.year
    year = start_dt.year
    start_month = start_dt.month
    end_month = end_dt.month
    first_hour_start_month = pd.Timestamp(f"{year}-{start_month:02d}-01 00:00:00")
    last_hour_end_month = pd.Timestamp(f"{year}-{end_month:02d}-{get_last_date_of_month(end_dt)} 23:00:00")
    months = [f"{year}-{month:02d}" for month in range(start_month, end_month + 1)]
    if start_dt != first_hour_start_month:
        months = months[1:]
    if end_dt != last_hour_end_month:
        months = months[:-1]
    # residual
    residual = []
    last_hour_start_month = pd.Timestamp(f"{year}-{start_month:02d}-{get_last_date_of_month(start_dt)} 23:00:00")
    first_hour_end_month = pd.Timestamp(f"{year}-{end_month:02d}-01 00:00:00")
    if end_dt <= last_hour_start_month:
        residual.append([start_dt, end_dt])
    else:
        if start_dt != first_hour_start_month:
            residual.append([start_dt, last_hour_start_month])
        if end_dt < last_hour_end_month:
            residual.append([first_hour_end_month, end_dt])
    # print("months:", months)
    # print("day residual:", residual)
    return months, residual


def get_whole_day_between(start_dt, end_dt):
    assert start_dt.year == end_dt.year
    assert start_dt.month == end_dt.month
    year = start_dt.year
    month = start_dt.month
    start_day = start_dt.day
    end_day = end_dt.day
    first_hour_start_day = pd.Timestamp(f"{year}-{month:02d}-{start_day:02d} 00:00:00")
    last_hour_end_day = pd.Timestamp(f"{year}-{month:02d}-{end_day:02d} 23:00:00")
    days = [f"{year}-{month:02d}-{day:02d}" for day in range(start_day, end_day + 1)]
    if start_dt != first_hour_start_day:
        days = days[1:]
    if end_dt != last_hour_end_day:
        days = days[:-1]
    # residual
    residual = []
    last_hour_start_day = pd.Timestamp(f"{year}-{month:02d}-{start_day:02d} 23:00:00")
    first_hour_end_day = pd.Timestamp(f"{year}-{month:02d}-{end_day:02d} 00:00:00")
    if end_dt <= last_hour_start_day:
        residual.append([start_dt, end_dt])
    else:
        if start_dt != first_hour_start_day:
            residual.append([start_dt, last_hour_start_day])
        if end_dt < last_hour_end_day:
            residual.append([first_hour_end_day, end_dt])
    # print("days:", days)
    # print("hour residual:", residual)
    return days, residual


def get_whole_hour_between(start_dt, end_dt):
    assert start_dt.year == end_dt.year
    assert start_dt.month == end_dt.month
    assert start_dt.day == end_dt.day
    year = start_dt.year
    month = start_dt.month
    day = start_dt.day
    start_hour = start_dt.hour
    end_hour = end_dt.hour
    hours = [f"{year}-{month:02d}-{day:02d} {hour:02d}:00:00" for hour in range(start_hour, end_hour + 1)]
    # print("hours:", hours)
    return hours


def get_whole_period_between(start, end):
    start_dt = pd.Timestamp(start)
    end_dt = pd.Timestamp(end)
    whole_months = []
    whole_days = []
    whole_hours = []
    whole_years, residual = get_whole_year_between(start_dt, end_dt)
    for res in residual:
        months, residual = get_whole_month_between(pd.Timestamp(res[0]), pd.Timestamp(res[1]))
        whole_months.extend(months)
        for res in residual:
            days, residual = get_whole_day_between(pd.Timestamp(res[0]), pd.Timestamp(res[1]))
            whole_days.extend(days)
            for res in residual:
                hours = get_whole_hour_between(pd.Timestamp(res[0]), pd.Timestamp(res[1]))
                whole_hours.extend(hours)
    print("******************")
    print("whole year")
    for y in whole_years:
        print(y)
    print("whole month")
    for m in whole_months:
        print(m)
    print("whole day")
    for d in whole_days:
        print(d)
    print("whole hour")
    for h in whole_hours:
        print(h)
    return whole_years, whole_months, whole_days, whole_hours


def get_total_hours_in_year(year):
    return 24 * 365 if calendar.isleap(year) else 24 * 366


def get_total_hours_in_month(month):
    return 24 * get_last_date_of_month(pd.Timestamp(month))


def get_total_hours_between(start, end):
    start_dt = pd.to_datetime(start)
    end_dt = pd.to_datetime(end)
    return int((end_dt - start_dt) / pd.Timedelta("1 hour")) + 1



def gen_file_list(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    time_resolution: str,  # e.g., "hour", "day", "month", "year"
    time_agg_method: str,  # e.g., "mean", "max", "min"
):
    file_list = []
    if time_resolution == "hour":
        start_year = start_datetime[:4]
        end_year = end_datetime[:4]
        for year in range(int(start_year), int(end_year) + 1):
            file_path = f"{RAW_DATA_PATH}/{variable}/{variable}-{year}.nc"
            file_list.append(file_path)
    else:
        file_path = f"{AGG_DATA_PATH}/{variable}/{variable}-{time_resolution}-{time_agg_method}.nc"
        file_list.append(file_path)
    print(file_list)
    return file_list


def get_raster(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    time_resolution: str,  # e.g., "hour", "day", "month", "year"
    time_agg_method: str,  # e.g., "mean", "max", "min"
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
    # spatial_resolution: float,  # e.g., 0.25, 0.5, 1.0, 2.5, 5.0
):
    file_list = gen_file_list(variable, start_datetime, end_datetime, time_resolution, time_agg_method)
    ds_list = []
    for file in file_list:
        ds = xr.open_dataset(file, engine="netcdf4").sel(
            time=slice(start_datetime, end_datetime),
            latitude=slice(max_lat, min_lat),
            longitude=slice(min_lon, max_lon),
        )
        ds_list.append(ds)
    ds = xr.concat(ds_list, dim="time")
    return ds


def get_timeseries(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    time_resolution: str,  # e.g., "hour", "day", "month", "year"
    time_agg_method: str,  # e.g., "mean", "max", "min"
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
    time_series_aggregation_method: str,  # e.g., "mean", "max", "min"
):
    ds = get_raster(
        variable,
        start_datetime,
        end_datetime,
        time_resolution,
        time_agg_method,
        min_lat,
        max_lat,
        min_lon,
        max_lon,
    )
    if time_series_aggregation_method == "mean":
        ts = ds.mean(dim=["latitude", "longitude"])
    elif time_series_aggregation_method == "max":
        ts = ds.max(dim=["latitude", "longitude"])
    elif time_series_aggregation_method == "min":
        ts = ds.min(dim=["latitude", "longitude"])
    return ts


def get_mean_heatmap(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
):
    years, months, days, hours = get_whole_period_between(start_datetime, end_datetime)
    year_hours = []
    month_hours = []
    day_hours = []
    hour_hours = []
    xrds_list = []

    if years:
        year = xr.open_dataset(f"{AGG_DATA_PATH}/{variable}/{variable}-year-mean.nc")
        year_match = [f"{y}-12-31 00:00:00" for y in years]
        year_selected = year.sel(time=year_match, latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon))
        year_hours = [get_total_hours_in_year(y) for y in years]
        xrds_list.append(year_selected)

    if months:
        month = xr.open_dataset(f"{AGG_DATA_PATH}/{variable}/{variable}-month-mean.nc")
        month_match = [f"{m}-{get_last_date_of_month(pd.Timestamp(m))} 00:00:00" for m in months]
        month_selected = month.sel(
            time=month_match, latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon)
        )
        month_hours = [get_total_hours_in_month(m) for m in months]
        xrds_list.append(month_selected)

    if days:
        day = xr.open_dataset(f"{AGG_DATA_PATH}/{variable}/{variable}-day-mean.nc")
        day_match = [f"{d} 00:00:00" for d in days]
        day_selected = day.sel(time=day_match, latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon))
        day_hours = [24 for _ in days]
        xrds_list.append(day_selected)

    if hours:
        year_hour_dict = {}
        for h in hours:
            year = h.split("-")[0]
            if year not in year_hour_dict:
                year_hour_dict[year] = []
            year_hour_dict[year].append(h)

        ds_list = []
        for y in year_hour_dict:
            file_path = f"{RAW_DATA_PATH}/{variable}/{variable}-{y}.nc"
            ds = xr.open_dataset(file_path, engine="netcdf4").sel(
                time=year_hour_dict[y], latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon)
            )
            ds_list.append(ds)
        hour_selected = xr.concat(ds_list, dim="time")
        hour_hours = [1 for _ in hours]
        xrds_list.append(hour_selected)

    xrds_concat = xr.concat(xrds_list, dim="time")
    nd_array = xrds_concat["t2m"].to_numpy()
    weights = np.array(year_hours + month_hours + day_hours + hour_hours)
    total_hours = get_total_hours_between(start_datetime, end_datetime)
    weights = weights / total_hours
    average = np.average(nd_array, axis=0, weights=weights)
    res = xr.Dataset(
        {long_short_name_dict[variable]: (["latitude", "longitude"], average)},
        coords={"latitude": xrds_concat.latitude, "longitude": xrds_concat.longitude},
    )
    return res


def get_min_heatmap(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
):
    years, months, days, hours = get_whole_period_between(start_datetime, end_datetime)
    xrds_list = []

    if years:
        year = xr.open_dataset(f"{AGG_DATA_PATH}/{variable}/{variable}-year-min.nc")
        year_match = [f"{y}-12-31 00:00:00" for y in years]
        year_selected = year.sel(time=year_match, latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon))
        xrds_list.append(year_selected)

    if months:
        month = xr.open_dataset(f"{AGG_DATA_PATH}/{variable}/{variable}-month-min.nc")
        month_match = [f"{m}-{get_last_date_of_month(pd.Timestamp(m))} 00:00:00" for m in months]
        month_selected = month.sel(
            time=month_match, latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon)
        )
        xrds_list.append(month_selected)

    if days:
        day = xr.open_dataset(f"{AGG_DATA_PATH}/{variable}/{variable}-day-min.nc")
        day_match = [f"{d} 00:00:00" for d in days]
        day_selected = day.sel(time=day_match, latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon))
        xrds_list.append(day_selected)

    if hours:
        year_hour_dict = {}
        for h in hours:
            year = h.split("-")[0]
            if year not in year_hour_dict:
                year_hour_dict[year] = []
            year_hour_dict[year].append(h)

        ds_list = []
        for y in year_hour_dict:
            file_path = f"{RAW_DATA_PATH}/{variable}/{variable}-{y}.nc"
            ds = xr.open_dataset(file_path, engine="netcdf4").sel(
                time=year_hour_dict[y], latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon)
            )
            ds_list.append(ds)
        hour_selected = xr.concat(ds_list, dim="time")
        xrds_list.append(hour_selected)

    xrds_concat = xr.concat(xrds_list, dim="time")
    res = xrds_concat.min(dim="time")

    return res


def get_max_heatmap(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
):
    years, months, days, hours = get_whole_period_between(start_datetime, end_datetime)
    xrds_list = []

    if years:
        year = xr.open_dataset(f"{AGG_DATA_PATH}/{variable}/{variable}-year-max.nc")
        year_match = [f"{y}-12-31 00:00:00" for y in years]
        year_selected = year.sel(time=year_match, latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon))
        xrds_list.append(year_selected)

    if months:
        month = xr.open_dataset(f"{AGG_DATA_PATH}/{variable}/{variable}-month-max.nc")
        month_match = [f"{m}-{get_last_date_of_month(pd.Timestamp(m))} 00:00:00" for m in months]
        month_selected = month.sel(
            time=month_match, latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon)
        )
        xrds_list.append(month_selected)

    if days:
        day = xr.open_dataset(f"{AGG_DATA_PATH}/{variable}/{variable}-day-max.nc")
        day_match = [f"{d} 00:00:00" for d in days]
        day_selected = day.sel(time=day_match, latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon))
        xrds_list.append(day_selected)

    if hours:
        year_hour_dict = {}
        for h in hours:
            year = h.split("-")[0]
            if year not in year_hour_dict:
                year_hour_dict[year] = []
            year_hour_dict[year].append(h)

        ds_list = []
        for y in year_hour_dict:
            file_path = f"{RAW_DATA_PATH}/{variable}/{variable}-{y}.nc"
            ds = xr.open_dataset(file_path, engine="netcdf4").sel(
                time=year_hour_dict[y], latitude=slice(max_lat, min_lat), longitude=slice(min_lon, max_lon)
            )
            ds_list.append(ds)
        hour_selected = xr.concat(ds_list, dim="time")
        xrds_list.append(hour_selected)

    xrds_concat = xr.concat(xrds_list, dim="time")
    res = xrds_concat.max(dim="time")
    return res


def get_heatmap(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
    heatmap_aggregation_method: str,  # e.g., "mean", "max", "min"
):
    if heatmap_aggregation_method == "mean":
        return get_mean_heatmap(
            variable,
            start_datetime,
            end_datetime,
            min_lat,
            max_lat,
            min_lon,
            max_lon,
        )
    elif heatmap_aggregation_method == "max":
        return get_max_heatmap(
            variable,
            start_datetime,
            end_datetime,
            min_lat,
            max_lat,
            min_lon,
            max_lon,
        )
    elif heatmap_aggregation_method == "min":
        return get_min_heatmap(
            variable,
            start_datetime,
            end_datetime,
            min_lat,
            max_lat,
            min_lon,
            max_lon,
        )
    else:
        raise ValueError("Invalid heatmap_aggregation_method")


def find_time_baseline(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    time_resolution: str,  # e.g., "hour", "day", "month", "year"
    time_agg_method: str,  # e.g., "mean", "max", "min"
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
    time_series_aggregation_method: str,  # e.g., "mean", "max", "min"
    filter_predicate: str,  # e.g., ">", "<", "==", "!=", ">=", "<="
    filter_value: float,
):
    ts = get_timeseries(
        variable,
        start_datetime,
        end_datetime,
        time_resolution,
        time_agg_method,
        min_lat,
        max_lat,
        min_lon,
        max_lon,
        time_series_aggregation_method,
    )
    if filter_predicate == ">":
        res = ts.where(ts > filter_value, drop=False)
    elif filter_predicate == "<":
        res = ts.where(ts < filter_value, drop=False)
    elif filter_predicate == "==":
        res = ts.where(ts == filter_value, drop=False)
    elif filter_predicate == "!=":
        res = ts.where(ts != filter_value, drop=False)
    elif filter_predicate == ">=":
        res = ts.where(ts >= filter_value, drop=False)
    elif filter_predicate == "<=":
        res = ts.where(ts <= filter_value, drop=False)
    res = res.fillna(False)
    res = res.astype(bool)
    return res


def find_time_pyramid(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    time_resolution: str,  # e.g., "hour", "day", "month", "year"
    time_agg_method: str,  # e.g., "mean", "max", "min"
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
    time_series_aggregation_method: str,  # e.g., "mean", "max", "min"
    filter_predicate: str,  # e.g., ">", "<", "==", ">=", "<="
    filter_value: float,
):
    # TODO:
    pass


def find_area_baseline(
    variable: str,
    start_datetime: str,
    end_datetime: str,
    min_lat: float,
    max_lat: float,
    min_lon: float,
    max_lon: float,
    heatmap_aggregation_method: str,  # e.g., "mean", "max", "min"
    filter_predicate: str,  # e.g., ">", "<", "==", "!=", ">=", "<="
    filter_value: float,
):
    hm = get_heatmap(
        variable,
        start_datetime,
        end_datetime,
        min_lat,
        max_lat,
        min_lon,
        max_lon,
        heatmap_aggregation_method,
    )
    if filter_predicate == ">":
        res = hm.where(hm > filter_value, drop=False)
    elif filter_predicate == "<":
        res = hm.where(hm < filter_value, drop=False)
    elif filter_predicate == "==":
        res = hm.where(hm == filter_value, drop=False)
    elif filter_predicate == "!=":
        res = hm.where(hm != filter_value, drop=False)
    elif filter_predicate == ">=":
        res = hm.where(hm >= filter_value, drop=False)
    elif filter_predicate == "<=":
        res = hm.where(hm <= filter_value, drop=False)
    res = res.fillna(False)
    res = res.astype(bool)
    return res