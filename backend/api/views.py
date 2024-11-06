import json
import logging

import geopandas as gpd
import plotly.express as px
import plotly.graph_objs as go
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_naive
from rest_framework.decorators import api_view
from rest_framework.response import Response
from shapely.geometry import Polygon

from .iharp_query.query import get_raster, get_timeseries, get_heatmap, find_time_pyramid, find_area_baseline
from .serializers import QuerySeriazlier, TimeSeriesSerializer, FindTimeSerializer

logger = logging.getLogger(__name__)
FORMAT = "[%(asctime)s %(name)s-%(levelname)s]: %(message)s"
logging.basicConfig(level=logging.INFO, format=FORMAT, datefmt="%d/%b/%Y %H:%M:%S")


def format_datetime_string(dt_input):
    """
    Convert input datetime
    from 2023-01-01T00:00:00.000Z
    to 2023-01-01 00:00:00
    """
    dt = parse_datetime(dt_input)
    if dt and dt.tzinfo is not None:  # Convert to naive datetime (if they have timezone info)
        dt = make_naive(dt)
    dt_formatted = dt.strftime("%Y-%m-%d %H:%M:%S") if dt else None
    return dt_formatted


@api_view(["POST"])
def query(request):
    logger.info("Request for raster")
    serializer = QuerySeriazlier(data=request.data)
    if serializer.is_valid():
        serializer.save()
        logger.info(request.data)
        variable = request.data.get("variable")
        start_datetime = request.data.get("startDateTime")
        end_datetime = request.data.get("endDateTime")
        time_resolution = request.data.get("temporalLevel")
        time_agg_method = request.data.get("aggLevel")
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)

        formatted_start = format_datetime_string(start_datetime)
        formatted_end = format_datetime_string(end_datetime)

        ds = get_raster(
            variable=variable,
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            time_resolution=time_resolution,
            time_agg_method=time_agg_method,
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
        )

        response = ds.__str__()

        return Response(response, status=201)

    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(["POST"])
def timeseries(request):
    logger.info("Request for time series")
    serializer = TimeSeriesSerializer(data=request.data)

    # df =  ts.to_pandas()
    # plotly go.figure()

    # then some to_json
    # Would need plotly in both frontend and backend
    # Then send the json data to frontend, previously they wrote them to a json file but just pass the large json data
    if serializer.is_valid():
        logger.info(request.data)
        serializer.save()

        variable = request.data.get("variable")
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        startDateTime = request.data.get("startDateTime")
        endDateTime = request.data.get("endDateTime")
        temporalLevel = request.data.get("temporalLevel")
        time_agg_method = request.data.get("aggLevel")
        ts_agg_method = request.data.get("secondAgg")

        start_dt = parse_datetime(startDateTime)
        end_dt = parse_datetime(endDateTime)

        # Convert to naive datetimes (if they have timezone info)
        if start_dt and start_dt.tzinfo is not None:
            start_dt = make_naive(start_dt)

        if end_dt and end_dt.tzinfo is not None:
            end_dt = make_naive(end_dt)

        # Format the datetimes to "YYYY-MM-DD HH:MM:SS"
        formatted_start = start_dt.strftime("%Y-%m-%d %H:%M:%S") if start_dt else None
        formatted_end = end_dt.strftime("%Y-%m-%d %H:%M:%S") if end_dt else None

        ts = get_timeseries(
            variable="2m_temperature",
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            time_resolution=temporalLevel,
            time_agg_method=time_agg_method,
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
            time_series_aggregation_method=ts_agg_method,
        )

        fig = go.Figure([go.Scatter(x=ts['time'], y=ts["t2m"])])

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
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        startDateTime = request.data.get("startDateTime")
        endDateTime = request.data.get("endDateTime")
        temporalLevel = request.data.get("temporalLevel")
        time_agg_method = request.data.get("aggLevel")
        hm_agg_method = request.data.get("secondAgg")

        start_dt = parse_datetime(startDateTime)
        end_dt = parse_datetime(endDateTime)

        # Convert to naive datetimes (if they have timezone info)
        if start_dt and start_dt.tzinfo is not None:
            start_dt = make_naive(start_dt)

        if end_dt and end_dt.tzinfo is not None:
            end_dt = make_naive(end_dt)

        # Format the datetimes to "YYYY-MM-DD HH:MM:SS"
        formatted_start = start_dt.strftime("%Y-%m-%d %H:%M:%S") if start_dt else None
        formatted_end = end_dt.strftime("%Y-%m-%d %H:%M:%S") if end_dt else None

        hm = get_heatmap(
            variable="2m_temperature",
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
            heatmap_aggregation_method=hm_agg_method,
        )
        fig = go.Figure(data=go.Heatmap(x=hm["longitude"], y=hm["latitude"], z=hm["t2m"], colorscale="RdBu_r"))
        fig.update_layout(
            yaxis=dict(scaleanchor="x", scaleratio=1),
            xaxis=dict(constrain="domain")
        )
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
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        startDateTime = request.data.get("startDateTime")
        endDateTime = request.data.get("endDateTime")
        temporalLevel = request.data.get("temporalLevel")
        time_agg_method = request.data.get("aggLevel")
        ts_agg_method = request.data.get("secondAgg")
        filter_predicate = request.data.get("filterPredicate")
        filter_value = request.data.get("filterValue")

        start_dt = parse_datetime(startDateTime)
        end_dt = parse_datetime(endDateTime)

        if start_dt and start_dt.tzinfo is not None:
            start_dt = make_naive(start_dt)

        if end_dt and end_dt.tzinfo is not None:
            end_dt = make_naive(end_dt)

        formatted_start = start_dt.strftime("%Y-%m-%d %H:%M:%S") if start_dt else None
        formatted_end = end_dt.strftime("%Y-%m-%d %H:%M:%S") if end_dt else None

        # TODO: Replace temporary static variables below:
        ts_agg_method = "mean"
        variable = "2m_temperature"
        filter_predicate = ">"
        filter_value = 263
        temporalLevel = "year"
        time_agg_method = "mean"
        ### Add check if temporal agg level is larger than the difference between start/end throw some error:
        # ie if tempAgg is 'year' but start - end = 2 months. That doesn't make sense. 

        ft = find_time_pyramid(
            variable=variable,
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            time_resolution=temporalLevel,
            time_agg_method=time_agg_method,
            max_lat=85,
            min_lat=60,
            min_lon=-70,
            max_lon=-10,
            time_series_aggregation_method="mean",
            filter_predicate=">",
            filter_value=263,
        ).compute()

        color_map = {True: "blue", False: "red"}
        fig = go.Figure(
            [
                go.Scatter(
                    x=ft["time"],
                    y=ft["t2m"],
                    marker=dict(size=15, color=[color_map[i] for i in ft["t2m"].values]),
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
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        startDateTime = request.data.get("startDateTime")
        endDateTime = request.data.get("endDateTime")
        temporalLevel = request.data.get("temporalLevel")
        time_agg_method = request.data.get("aggLevel")
        fa_agg_method = request.data.get("secondAgg")
        filter_predicate = request.data.get("filterPredicate")
        filter_value = request.data.get("filterValue")

        start_dt = parse_datetime(startDateTime)
        end_dt = parse_datetime(endDateTime)

        if start_dt and start_dt.tzinfo is not None:
            start_dt = make_naive(start_dt)

        if end_dt and end_dt.tzinfo is not None:
            end_dt = make_naive(end_dt)

        formatted_start = start_dt.strftime("%Y-%m-%d %H:%M:%S") if start_dt else None
        formatted_end = end_dt.strftime("%Y-%m-%d %H:%M:%S") if end_dt else None

        # TODO: Replace temporary static variables below:
        ts_agg_method = "mean"
        variable = "2m_temperature"
        filter_predicate = ">"
        filter_value = 260
        ### Also need updated query.py

        fa = find_area_baseline(
            variable=variable,
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
            heatmap_aggregation_method=fa_agg_method,
            filter_predicate=filter_predicate,
            filter_value=filter_value,
        )

        fa_low = fa.isel(latitude=slice(0, len(fa["latitude"]), 4), longitude=slice(0, len(fa["longitude"]), 4))
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
            hover_data={"t2m": True, "latitude": True, "longitude": True},
            color="t2m",
            center={"lat": gdf["latitude"].mean(), "lon": gdf["longitude"].mean()},
            opacity=0.3,
            zoom=1,
            color_discrete_map=color_mapping,
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
                        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
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
