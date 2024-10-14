from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path("page_one/", page_one, name="pageone"),
    path("query/", query, name="query"),
]   