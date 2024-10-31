from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework import generics
from .models import Query
from .serializers import QuerySeriazlier, TimeSeriesSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
import rest_framework.status as status
from datetime import datetime
import random
import json
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_naive
import plotly.graph_objs as go

from .iharp_query.query import get_raster, get_timeseries, get_heatmap

import logging

logger = logging.getLogger(__name__)
FORMAT = "[%(asctime)s %(name)s-%(levelname)s]: %(message)s"
logging.basicConfig(level=logging.INFO, format=FORMAT, datefmt="%d/%b/%Y %H:%M:%S")


@api_view(["POST"])
def query(request):
    logger.info("Request for raster")
    serializer = QuerySeriazlier(data=request.data)
    if serializer.is_valid():
        serializer.save()
        logger.info(request.data)
        variable = request.data.get("variable")
        north = round(float(request.data.get("north")), 3)
        south = round(float(request.data.get("south")), 3)
        east = round(float(request.data.get("east")), 3)
        west = round(float(request.data.get("west")), 3)
        startDateTime = request.data.get("startDateTime")
        endDateTime = request.data.get("endDateTime")
        temporalLevel = request.data.get("temporalLevel")
        time_agg_method = request.data.get("aggLevel")

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

        ds = get_raster(
            variable="2m_temperature",
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            time_resolution=temporalLevel,
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

# Sessino id for downloads in the future