from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import *

class ObiskViewSet(viewsets.ModelViewSet):
    queryset = Obisk.objects.all()
    serializer_class = ObiskSerializer
