from rest_framework import serializers
from .models import *


class GetRasterSeriazlier(serializers.ModelSerializer):
    class Meta:
        model = GetRasterQueryModel
        fields = [
            "id",
            "created_at",
            "dataset",
            "variable",
            "startDateTime",
            "endDateTime",
            "temporalResolution",
            "north",
            "south",
            "east",
            "west",
            "spatialResolution",
            "aggregation",
            "log_info",
            "domain",
            "height_level",
        ]


class HeatmapSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeatmapQueryModel
        fields = [
            "id",
            "created_at",
            "dataset",
            "variable",
            "startDateTime",
            "endDateTime",
            "north",
            "south",
            "east",
            "west",
            "spatialResolution",
            "aggregation",
            "log_info",
            "range_info",
            "domain",
            "height_level",
        ]


class TimeSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeseriesQueryModel
        fields = [
            "id",
            "created_at",
            "dataset",
            "variable",
            "startDateTime",
            "endDateTime",
            "temporalResolution",
            "north",
            "south",
            "east",
            "west",
            "aggregation",
            "log_info",
            "domain",
            "height_level",
        ]


class FindTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FindTimeModel
        fields = [
            "id",
            "created_at",
            "dataset",
            "variable",
            "startDateTime",
            "endDateTime",
            "temporalResolution",
            "north",
            "south",
            "east",
            "west",
            "aggregation",
            "filterPredicate",
            "filterValue",
            "domain",
            "height_level",
        ]


class FindAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FindAreaModel
        fields = [
            "id",
            "created_at",
            "dataset",
            "variable",
            "startDateTime",
            "endDateTime",
            "north",
            "south",
            "east",
            "west",
            "spatialResolution",
            "aggregation",
            "filterPredicate",
            "filterValue",
            "domain",
            "height_level"
        ]
