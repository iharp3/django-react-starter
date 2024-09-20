from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path("home/", home, name="home"),
    path("plus/", plus_request, name="plus"),
]   