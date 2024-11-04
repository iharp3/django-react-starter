from django.db import models
from django.utils import timezone

class Query(models.Model):
    TEMPORAL_CHOICES = (
        ("hour", "hour"),
        ("day", "day"),
        ("month", "month"),
        ("year", "year"),
    )
    AGG_CHOICES = (
        ("min", "min"),
        ("max", "max"),
        ("mean", "mean"),
    )
    REQUEST_CHOICES = (
        ("Time Series", "Time Series"),
        ("Heat Map", "Heat Map"),
        ("Data Download", "Data Download"),
    )

    VARIABLE_CHOICES = (
        ("2m Temperature", "2m_temperature"),
        ("Surface Pressure", "surface_pressure"),
        ("Total Precipitation", "total_precipitation"),
    )

    FILTER_PREDICATE_CHOICES = [
        ('>', '>'),
        ('<', '<'),
        ('>=', '>='),
        ('<=', '<='),
        ('=', '='),
        ('!=', '!=')
    ]

    variable = models.CharField(max_length=50, choices=VARIABLE_CHOICES, default="2m_temperature")
    requestType = models.CharField(max_length=15, choices=REQUEST_CHOICES)
    startDateTime = models.DateTimeField(default=timezone.now)
    endDateTime = models.DateTimeField(default=timezone.now)
    temporalLevel = models.CharField(max_length=10, choices=TEMPORAL_CHOICES)
    aggLevel = models.CharField(max_length=10, choices=AGG_CHOICES)
    north = models.DecimalField(max_digits=40, decimal_places=35)
    east = models.DecimalField(max_digits=40, decimal_places=35)
    south = models.DecimalField(max_digits=40, decimal_places=35)
    west = models.DecimalField(max_digits=40, decimal_places=35)
    created_at = models.DateTimeField(auto_now_add=True)
    secondAgg = models.CharField(max_length=25, choices=AGG_CHOICES, default="min")
    filterPredicate = models.CharField(max_length=2, choices=FILTER_PREDICATE_CHOICES, default='=')        
    filterValue = models.FloatField(default=255.0)

    def __str__(self):
        return self.title
