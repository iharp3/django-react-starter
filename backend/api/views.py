import json
import os
import logging
import geopandas as gpd
import plotly.express as px
import plotly.graph_objs as go
from django.http import JsonResponse, FileResponse
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_naive
from rest_framework.decorators import api_view
from rest_framework.response import Response
from shapely.geometry import Polygon
import xarray as xr
from io import BytesIO

from .serializers import QuerySeriazlier, TimeSeriesSerializer, FindTimeSerializer
from .iharp_query_executor import (
    GetRasterExecutor,
    TimeseriesExecutor,
    HeatmapExecutor,
    FindTimeExecutor,
    FindAreaExecutor,
    long_short_name_dict,
)

logger = logging.getLogger(__name__)
MSG_FORMAT = "[%(asctime)s %(name)s-%(levelname)s]: %(message)s"
LOG_DATE_FORMAT = "%d/%b/%Y %H:%M:%S"
logging.basicConfig(level=logging.INFO, format=MSG_FORMAT, datefmt=LOG_DATE_FORMAT)

metadata_fpath = "/data/metadata.csv"


def format_datetime_string(dt_input):
    """
    Convert input datetime
    from 2023-01-01T00:00:00.000Z
    to 2023-01-01 00:00:00
    """
    dt = parse_datetime(dt_input)
    if dt and dt.tzinfo is not None:
        dt = make_naive(dt)
    dt_formatted = dt.strftime("%Y-%m-%d %H:%M:%S") if dt else None
    return dt_formatted


def get_variable_short_name(variable):
    return long_short_name_dict.get(variable, variable)


@api_view(["POST"])
def query(request):
    logger.info("Request for raster")
    serializer = QuerySeriazlier(data=request.data)
    if serializer.is_valid():
        serializer.save()
        logger.info(request.data)
        variable = request.data.get("variable")
        variable = variable.lower().replace(" ", "_")
        start_datetime = request.data.get("startDateTime")
        end_datetime = request.data.get("endDateTime")
        time_resolution = request.data.get("temporalResolution")
        time_agg_method = request.data.get("temporalAggregation")
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        spatial_resolution = float(request.data.get("spatialResolution"))
        spatial_aggregation = request.data.get("spatialAggregation")

        formatted_start = format_datetime_string(start_datetime)
        formatted_end = format_datetime_string(end_datetime)

        qe = GetRasterExecutor(
            metadata=metadata_fpath,
            variable=variable,
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
            # min_lat=min_lat,
            # max_lat=max_lat,
            # min_lon=min_lon,
            # max_lon=max_lon,
            temporal_resolution=time_resolution,
            temporal_aggregation=time_agg_method,
            spatial_resolution=spatial_resolution,
            spatial_aggregation=spatial_aggregation,
        )
        ds = qe.execute()
        response = ds.__str__()

        return Response(response, status=201)

    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(["POST"])
def download_query(request):
    logger.info("Request for raster download")
    serializer = QuerySeriazlier(data=request.data)
    if serializer.is_valid():
        serializer.save()
        logger.info(request.data)
        variable = request.data.get("variable")
        variable = variable.lower().replace(" ", "_")
        start_datetime = request.data.get("startDateTime")
        end_datetime = request.data.get("endDateTime")
        time_resolution = request.data.get("temporalResolution")
        time_agg_method = request.data.get("temporalAggregation")
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        spatial_resolution = float(request.data.get("spatialResolution"))
        spatial_aggregation = request.data.get("spatialAggregation")
        rid = serializer.data["id"]

        formatted_start = format_datetime_string(start_datetime)
        formatted_end = format_datetime_string(end_datetime)

        qe = GetRasterExecutor(
            metadata=metadata_fpath,
            variable=variable,
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
            # min_lat=min_lat,
            # max_lat=max_lat,
            # min_lon=min_lon,
            # max_lon=max_lon,
            temporal_resolution=time_resolution,
            temporal_aggregation=time_agg_method,
            spatial_resolution=spatial_resolution,
            spatial_aggregation=spatial_aggregation,
        )
        ds = qe.execute()

        tmp_dir = "tmp/data"
        if not os.path.exists(tmp_dir):
            os.makedirs(tmp_dir)

        file_name = f"iHARPV_{rid}.nc"
        file_path = f"{tmp_dir}/{file_name}"
        ds.to_netcdf(file_path)

        if os.path.exists(file_path):

            # TODO: Dynamically Delete written files.

            # def cleanup_file():
            #     print("Attempted Cleanup")
            #     if os.path.exists(file_path):
            #         os.remove(file_path)
            #         print(f"Removed {file_path}")

            response = FileResponse(open(file_path, "rb"), as_attachment=True)

            # response.close_connection = cleanup_file
            response["Content-Disposition"] = f'attachment; filename="{file_name}"'
            return response
        else:
            return JsonResponse({"error": "File not found"}, status=404)

    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(["POST"])
def timeseries(request):
    logger.info("Request for time series")
    serializer = TimeSeriesSerializer(data=request.data)

    if serializer.is_valid():
        logger.info(request.data)
        serializer.save()

        variable = request.data.get("variable")
        variable = variable.lower().replace(" ", "_")
        start_datetime = request.data.get("startDateTime")
        end_datetime = request.data.get("endDateTime")
        time_resolution = request.data.get("temporalResolution")
        time_agg_method = request.data.get("temporalAggregation")
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        spatial_resolution = float(request.data.get("spatialResolution"))
        spatial_aggregation = request.data.get("spatialAggregation")
        ts_agg_method = request.data.get("secondAgg")

        formatted_start = format_datetime_string(start_datetime)
        formatted_end = format_datetime_string(end_datetime)

        qe = TimeseriesExecutor(
            metadata=metadata_fpath,
            variable=variable,
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
            # min_lat=min_lat,
            # max_lat=max_lat,
            # min_lon=min_lon,
            # max_lon=max_lon,
            temporal_resolution=time_resolution,
            temporal_aggregation=time_agg_method,
            time_series_aggregation_method=ts_agg_method,
            spatial_resolution=spatial_resolution,
            spatial_aggregation=spatial_aggregation,
        )
        ts = qe.execute()

        short_variable = get_variable_short_name(variable)
        fig = go.Figure([go.Scatter(x=ts["valid_time"], y=ts[short_variable])])

        json_fig = fig.to_json()
        json_data = json.loads(json_fig)

        return JsonResponse(json_data, status=201)

    logger.error("Invalid data: %s", serializer.errors)
    return JsonResponse({"error": "Invalid data"}, status=400)


@api_view(["POST"])
def heatmap(request):
    logger.info("Request for heat map")
    # Can just ues the time series serializer since it's
    # dealing with the same data
    serializer = TimeSeriesSerializer(data=request.data)

    if serializer.is_valid():
        logger.info(request.data)
        serializer.save()

        variable = request.data.get("variable")
        variable = variable.lower().replace(" ", "_")
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        start_datetime = request.data.get("startDateTime")
        end_datetime = request.data.get("endDateTime")
        temporalResolution = request.data.get("temporalResolution")
        time_agg_method = request.data.get("temporalAggregation")
        hm_agg_method = request.data.get("secondAgg")
        spatial_resolution = float(request.data.get("spatialResolution"))
        spatial_aggregation = request.data.get("spatialAggregation")

        var_short_name = get_variable_short_name(variable)
        formatted_start = format_datetime_string(start_datetime)
        formatted_end = format_datetime_string(end_datetime)

        qe = HeatmapExecutor(
            metadata=metadata_fpath,
            variable=variable,
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
            # min_lat=min_lat,
            # max_lat=max_lat,
            # min_lon=min_lon,
            # max_lon=max_lon,
            spatial_resolution=spatial_resolution,
            spatial_aggregation=spatial_aggregation,
            heatmap_aggregation_method=hm_agg_method,
        )
        hm = qe.execute()

        fig = go.Figure(data=go.Heatmap(x=hm["longitude"], y=hm["latitude"], z=hm[var_short_name], colorscale="RdBu_r"))
        fig.update_traces(hovertemplate=f"lon: %{{x}}<br>lat: %{{y}}<br>{var_short_name}: %{{z}}<extra></extra>")
        fig.update_layout(yaxis=dict(scaleanchor="x", scaleratio=1), xaxis=dict(constrain="domain"))
        json_fig = fig.to_json()
        json_data = json.loads(json_fig)

        return JsonResponse(json_data, status=201)

    logger.error("Invalid data: %s", serializer.errors)
    return JsonResponse({"error": "Invalid data"}, status=400)


@api_view(["POST"])
def findTime(request):
    logger.info("Request for find time")
    serializer = FindTimeSerializer(data=request.data)

    if serializer.is_valid():
        logger.info(request.data)
        serializer.save()

        variable = request.data.get("variable")
        variable = variable.lower().replace(" ", "_")
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        start_datetime = request.data.get("startDateTime")
        end_datetime = request.data.get("endDateTime")
        temporalResolution = request.data.get("temporalResolution")
        time_agg_method = request.data.get("temporalAggregation")
        ts_agg_method = request.data.get("secondAgg")
        filter_predicate = request.data.get("filterPredicate")
        filter_value = request.data.get("filterValue")
        spatial_resolution = float(request.data.get("spatialResolution"))
        spatial_aggregation = request.data.get("spatialAggregation")

        var_short_name = get_variable_short_name(variable)
        formatted_start = format_datetime_string(start_datetime)
        formatted_end = format_datetime_string(end_datetime)

        # TODO: Replace temporary static variable for ts_agg_method below:
        ### Add check if temporal agg level is larger than the difference between start/end throw some error:
        # ie if tempAgg is 'year' but start - end = 2 months. That doesn't make sense.

        qe = FindTimeExecutor(
            metadata=metadata_fpath,
            variable=variable,
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
            temporal_resolution=temporalResolution,
            temporal_aggregation=time_agg_method,
            time_series_aggregation_method=ts_agg_method,
            filter_predicate=filter_predicate,
            filter_value=float(filter_value),
            spatial_resolution=spatial_resolution,
            spatial_aggregation=spatial_aggregation,
        )
        ft = qe.execute()

        color_map = {True: "blue", False: "red"}
        fig = go.Figure(
            [
                go.Scatter(
                    x=ft["valid_time"],
                    y=ft[var_short_name],
                    mode="lines+markers",
                    marker=dict(size=12, color=[color_map[i] for i in ft[var_short_name].values]),
                    line=dict(color="lightgray"),
                )
            ]
        )
        json_fig = fig.to_json()
        json_data = json.loads(json_fig)

        return JsonResponse(json_data, status=201)

    logger.error("Invalid data: %s", serializer.errors)
    return JsonResponse({"error": "Invalid data"}, status=400)


@api_view(["POST"])
def findArea(request):
    logger.info("Request for find area")
    # Can copy this serializer
    serializer = FindTimeSerializer(data=request.data)

    if serializer.is_valid():
        logger.info(request.data)
        serializer.save()

        variable = request.data.get("variable")
        variable = variable.lower().replace(" ", "_")
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        start_datetime = request.data.get("startDateTime")
        end_datetime = request.data.get("endDateTime")
        temporalResolution = request.data.get("temporalResolution")
        time_agg_method = request.data.get("temporalAggregation")
        spatial_resolution = float(request.data.get("spatialResolution"))
        spatial_aggregation = request.data.get("spatialAggregation")
        fa_agg_method = request.data.get("secondAgg")
        filter_predicate = request.data.get("filterPredicate")
        filter_value = request.data.get("filterValue")

        var_short_name = get_variable_short_name(variable)
        formatted_start = format_datetime_string(start_datetime)
        formatted_end = format_datetime_string(end_datetime)

        # TODO: Replace temporary static variables below

        qe = FindAreaExecutor(
            variable=variable,
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
            heatmap_aggregation_method=fa_agg_method,
            filter_predicate=filter_predicate,
            filter_value=float(filter_value),
            spatial_resolution=spatial_resolution,
            spatial_aggregation=spatial_aggregation,
            metadata=metadata_fpath,
        )
        fa = qe.execute()

        fa_low = fa
        # fa_low = fa.isel(latitude=slice(0, len(fa["latitude"]), 4), longitude=slice(0, len(fa["longitude"]), 4))
        df = fa_low.to_dataframe().reset_index()
        df["latitude"] = df["latitude"] - 0.5
        df["longitude"] = df["longitude"] - 0.5
        df["latitude2"] = df["latitude"] + 1
        df["longitude2"] = df["longitude"] + 1
        gdf = gpd.GeoDataFrame(
            df,
            geometry=[
                Polygon([(x, y), (x, y2), (x2, y2), (x2, y)])
                for x, y, x2, y2 in zip(df["longitude"], df["latitude"], df["longitude2"], df["latitude2"])
            ],
        )
        color_mapping = {True: "blue", False: "red"}
        fig = px.choropleth_mapbox(
            gdf,
            geojson=gdf.geometry,
            locations=gdf.index,
            hover_data={var_short_name: ":.2f", "latitude": ":.3f", "longitude": ":.3f"},
            color=var_short_name,
            center={"lat": gdf["latitude"].mean(), "lon": gdf["longitude"].mean()},
            opacity=0.3,
            zoom=1,
            color_discrete_map=color_mapping,
        )

        fig.update_traces(
            hovertemplate=(
                "Lat: %{customdata[1]:.3f}<br>"
                + "Lon: %{customdata[2]:.3f}<br>"
                + f"{var_short_name}: %{{customdata[0]}}<br>"
                + "<extra></extra>"
            )
        )

        fig.update_traces(marker_line_width=0)
        fig.update_layout(
            mapbox_style="white-bg",
            mapbox_bounds_east=180,
            mapbox_bounds_north=90,
            mapbox_bounds_west=-180,
            mapbox_bounds_south=-90,
            mapbox_layers=[
                {
                    "below": "traces",
                    "sourcetype": "raster",
                    "sourceattribution": "United States Geological Survey",
                    "source": [
                        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    ],
                }
            ],
            margin={"r": 0, "t": 0, "l": 0, "b": 0},
            showlegend=True,
            legend=dict(
                font=dict(size=11),
                x=1,  # Adjust the x position (0 to 1, 1 is far right)
                y=0.9,  # Adjust the y position (0 to 1, 1 is top)
                xanchor="right",  # Anchors the legend's x position
                yanchor="top",  # Anchors the legend's y position
            ),
        )

        json_fig = fig.to_json()
        json_data = json.loads(json_fig)

        return JsonResponse(json_data, status=201)

    logger.error("Invalid data: %s", serializer.errors)
    return JsonResponse({"error": "Invalid data"}, status=400)
