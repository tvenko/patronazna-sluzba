from django.shortcuts import render
from rest_framework import viewsets, permissions
from delovniNalog.serializers import *

class VrstaObiskaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VrstaObiska.objects.all()
    permission_class = (permissions.AllowAny)
    serializer_class = VrstaObiskaSerializer

class BolezenViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bolezen.objects.all()
    permission_class = (permissions.AllowAny)
    serializer_class = BolezenSerializer

class MaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Material.objects.all()
    permission_class = (permissions.AllowAny)
    serializer_class =MaterialSerializer

class ZdravilaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Zdravilo.objects.all()
    permission_class = permissions.AllowAny
    serializer_class = ZdraviloSerializer