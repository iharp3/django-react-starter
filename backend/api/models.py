from django.db import models
from django.utils import timezone


class Query(models.Model):
    TEMPORAL_CHOICES = [
        ("hour", "hour"),
        ("day", "day"),
        ("month", "month"),
        ("year", "year"),
    ]

    AGG_CHOICES = [
        ("min", "min"),
        ("max", "max"),
        ("mean", "mean"),
        ("none", "none"),
    ]

    REQUEST_CHOICES = [
        ("get_raster", "get_raster"),
        ("timeseries", "timeseries"),
        ("heatmap", "heatmap"),
        ("find_time", "find_time"),
        ("find_area", "find_area"),
        # ("Time Series", "Time Series"),
        # ("Heat Map", "Heat Map"),
        # ("Data Download", "Data Download"),
    ]

    VARIABLE_CHOICES = [
        ("2m_temperature", "2m_temperature"),
        ("surface_pressure", "surface_pressure"),
        ("sea_surface_temperature", "sea_surface_temperature"),
        ("Total Precipitation", "total_precipitation"),
    ]

    FILTER_PREDICATE_CHOICES = [
        (">", ">"),
        ("<", "<"),
        (">=", ">="),
        ("<=", "<="),
        ("=", "="),
        ("!=", "!="),
    ]

    requestType = models.CharField(max_length=15, choices=REQUEST_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    variable = models.CharField(max_length=50, choices=VARIABLE_CHOICES)
    startDateTime = models.DateTimeField()
    endDateTime = models.DateTimeField()
    temporalResolution = models.CharField(max_length=10, choices=TEMPORAL_CHOICES)
    temporalAggregation = models.CharField(max_length=10, choices=AGG_CHOICES)
    north = models.DecimalField(max_digits=25, decimal_places=20)
    east = models.DecimalField(max_digits=25, decimal_places=20)
    south = models.DecimalField(max_digits=25, decimal_places=20)
    west = models.DecimalField(max_digits=25, decimal_places=20)
    spatialResolution = models.DecimalField(max_digits=3, decimal_places=2)
    spatialAggregation = models.CharField(max_length=10, choices=AGG_CHOICES)
    secondAgg = models.CharField(max_length=25, choices=AGG_CHOICES, null=True)
    filterPredicate = models.CharField(max_length=2, choices=FILTER_PREDICATE_CHOICES, null=True)
    filterValue = models.FloatField(null=True)

    def __str__(self):
        return self.title
