from django.db import models
from datetime import datetime


# Create your models here.
class PlusRequest(models.Model):

    a = models.IntegerField()
    b = models.IntegerField()


    def __str__(self):
        return str(self.a + self.b)
    
AGGREGATION_CHOICES = [
        ("mean", "mean"),
        ("min", "min"),
        ("max", "max"),
    ]
SPATIAL_RESOLUTION_CHOICES = [
    ("0.25", "0.25"),
    ("0.5", "0.5"),
    ("1", "1"),
    ("2", "2"),
]
TEMPORAL_RESOLUTION_CHOICES = [
    ("hour", "hour"),
    ("day", "day"),
    ("month", "month"),
    ("year", "year"),
]

# Create your models here.
class RasterRequest(models.Model):
    variable = models.CharField(max_length=100)
    # spatial
    north = models.DecimalField(max_digits=5, decimal_places=3)
    south = models.DecimalField(max_digits=5, decimal_places=3)
    west = models.DecimalField(max_digits=6, decimal_places=3)
    east = models.DecimalField(max_digits=6, decimal_places=3)
    # spatial_resolution = models.CharField(max_length=10, choices=SPATIAL_RESOLUTION_CHOICES, default="0.25")
    # spatial_agg_method = models.CharField(max_length=10, choices=AGGREGATION_CHOICES, default="mean")
    # temporal
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    temporal_resolution = models.CharField(max_length=10, choices=TEMPORAL_RESOLUTION_CHOICES, default="hour")
    temporal_agg_method = models.CharField(max_length=10, choices=AGGREGATION_CHOICES, default="mean")
    # metadata
    session_id = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.variable