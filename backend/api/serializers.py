from rest_framework import serializers
from .models import Query


class QuerySeriazlier(serializers.ModelSerializer):
    class Meta:
        model = Query
        # fields = "__all__"
        fields = [
            "id",
            "variable",
            "startDateTime",
            "endDateTime",
            "temporalResolution",
            "north",
            "south",
            "east",
            "west",
            "created_at",
            "temporalAggregation",
            "spatialResolution",
            "spatialAggregation",
        ]


class TimeSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = [
            "id",
            "variable",
            "startDateTime",
            "endDateTime",
            "temporalResolution",
            "north",
            "south",
            "east",
            "west",
            "created_at",
            "temporalAggregation",
            "secondAgg",
            "spatialResolution",
            "spatialAggregation",
        ]


class FindTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = [
            "id",
            "variable",
            "startDateTime",
            "endDateTime",
            "temporalResolution",
            "north",
            "south",
            "east",
            "west",
            "created_at",
            "temporalAggregation",
            "secondAgg",
            "filterPredicate",
            "filterValue",
            "spatialResolution",
            "spatialAggregation",
        ]
