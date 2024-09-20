from rest_framework import serializers
from .models import PlusRequest



class PlusRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlusRequest
        fields = "__all__"