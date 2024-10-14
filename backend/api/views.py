from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework import generics
from .models import Query
from .serializers import QuerySeriazlier
from rest_framework.decorators import api_view
from rest_framework.response import Response
import rest_framework.status as status
from datetime import datetime
import random
from .scripts import *
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_naive


@api_view(["GET"])
def page_one(request):    
    poo = "2023-01-01T06:00:00.000Z"
    start_time = "2023-01-01 00:00:00"
    end_time = "2023-01-03 00:00:00" # Through 2023-01-07 I think
    # Greenland
    max_lat = 85
    min_lat = 60
    min_lon = -70
    max_lon = -10

    html = ret_html(
        start_datetime=start_time,
        end_datetime=end_time,
        min_lat=min_lat,
        max_lat=max_lat,
        min_lon=min_lon,
        max_lon=max_lon,
    )
    ds = slice_raster(
        variable="2m_temperature",
        start_datetime=start_time,
        end_datetime=end_time,
        time_resolution="hour",
        time_agg_method="mean",
        min_lat=min_lat,
        max_lat=max_lat,
        min_lon=min_lon,
        max_lon=max_lon,
    )

    html_string = ds.__str__()

    # ds_dict = ds.to_dict()    

    return Response({"html_string": html_string})
    # return JsonResponse(ds_dict)
@api_view(["POST"])
def query(request):
    print("Request for Time Seies ")
    serializer = QuerySeriazlier(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print(request.data)
        north = round(float(request.data.get("north")),3)
        south = round(float(request.data.get("south")),3)
        east = round(float(request.data.get("east")),3)
        west = round(float(request.data.get("west")),3)
        startDateTime = request.data.get("startDateTime")
        endDateTime = request.data.get("endDateTime")
        temporalLevel = request.data.get("temporalLevel")
        variable = request.data.get("variable")

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

        ds = slice_raster(
            variable="2m_temperature",
            start_datetime=formatted_start,
            end_datetime=formatted_end,
            time_resolution="hour",
            time_agg_method="mean",
            min_lat=south,
            max_lat=north,
            min_lon=west,
            max_lon=east,
        )

        response = ds.__str__()

        return Response(response, status=201)

    print("Serializer errors:", serializer.errors)
    return Response(serializer.errors, status=400)

    return JsonResponse(form)