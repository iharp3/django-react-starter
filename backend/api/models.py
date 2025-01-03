from django.db import models
from django.utils import timezone


class Query(models.Model):
    TEMPORAL_CHOICES = (
        ("hour", "hour"),
        ("day", "day"),
        ("month", "month"),
        ("year", "year"),
    )

    SPATIAL_CHOICES = (
        (0.25, "0.25"),
        (0.5, "0.5"),
        (1, "1"),
    )

    AGG_CHOICES = (
        ("min", "min"),
        ("max", "max"),
        ("mean", "mean"),
    )
    REQUEST_CHOICES = (
        ("get_raster", "get_raster"),
        ("timeseries", "timeseries"),
        ("heatmap", "heatmap"),
        ("find_time", "find_time"),
        ("find_area", "find_area"),
        # ("Time Series", "Time Series"),
        # ("Heat Map", "Heat Map"),
        # ("Data Download", "Data Download"),
    )

    VARIABLE_CHOICES = (
        ("2m_temperature", "2m_temperature"),
        ("Surface Pressure", "surface_pressure"),
        ("Total Precipitation", "total_precipitation"),
    )

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
    variable = models.CharField(max_length=50, choices=VARIABLE_CHOICES, default="2m_temperature")
    startDateTime = models.DateTimeField()
    endDateTime = models.DateTimeField()
    temporalResolution = models.CharField(max_length=10, choices=TEMPORAL_CHOICES, default="day")
    temporalAggregation = models.CharField(max_length=10, choices=AGG_CHOICES, default="mean")
    north = models.DecimalField(max_digits=10, decimal_places=7)
    east = models.DecimalField(max_digits=10, decimal_places=7)
    south = models.DecimalField(max_digits=10, decimal_places=7)
    west = models.DecimalField(max_digits=10, decimal_places=7)
    secondAgg = models.CharField(max_length=25, choices=AGG_CHOICES, default="min")
    filterPredicate = models.CharField(max_length=2, choices=FILTER_PREDICATE_CHOICES, default="=")
    filterValue = models.FloatField(default=255.0)

    def __str__(self):
        return self.title
