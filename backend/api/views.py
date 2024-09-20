from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from .models import PlusRequest
from .serializers import PlusRequestSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
import rest_framework.status as status
from datetime import datetime
import random



# Create your views here.
def home(request):
    return HttpResponse("<h1>Hello, World!</h1>")


@api_view(["GET"])
def plus_request(request):
    a = request.query_params.get('a')
    b = request.query_params.get('b')

    if a == None or b == None:
        return Response({"error", "None types"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        a = int(a)
        b = int(b)
    except:
        return Response({"error", "Value types"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    result = a + b 

    return Response({"result": result})
