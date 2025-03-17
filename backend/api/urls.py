from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path("query/", get_raster_query, name="query"),
    path("download_raster/", download_query, name="download_raster"),
    path("timeseries/", timeseries_query, name="timeseries"),
    path("heatmap/", heatmap_query, name="heatmap"),
    path("findtime/", find_time_query, name="findtime"),
    path("findarea/", find_area_query, name="findarea"),
]
