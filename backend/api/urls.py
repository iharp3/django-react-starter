from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path("query/", query, name="query"),
    path("timeseries/", timeseries, name="timeseries"),
    path("heatmap/", heatmap, name="heatmap"),
    path("findtime/", findTime, name="findtime"),
    path("findarea/", findArea, name="findarea"),
]   