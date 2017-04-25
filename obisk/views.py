from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import *

class ObiskViewSet(viewsets.ModelViewSet):
    queryset = Obisk.objects.all()
    def get_serializer_class(self):
        if self.request.method == 'PUT':
            return ObiskUpdateSerializer
        return ObiskSerializer

class MeritevViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Meritev.objects.all()
    serializer_class = MeritevSeializer

class MeritveNaObiskuViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = MeritveNaObisku.objects.all()
	serializer_class = MeritveNaObiskuSerializer