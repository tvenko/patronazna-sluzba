from django.shortcuts import render
from rest_framework import viewsets, permissions
from delovniNalog.serializers import *

class VrstaObiskaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VrstaObiska.objects.all()
    serializer_class = VrstaObiskaSerializer

class BolezenViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bolezen.objects.all()
    serializer_class = BolezenSerializer

class MaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Material.objects.all()
    serializer_class =MaterialSerializer

class ZdravilaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Zdravilo.objects.all()
    serializer_class = ZdraviloSerializer

class DelovniNalogViewSet(viewsets.ModelViewSet):
    queryset = DelovniNalog.objects.all()
    serializer_class = DelovniNalogPostSerializer
    #def get_serializer_class(self):
    #    if self.request.method == 'POST':
    #        return DelovniNalogPostSerializer
    #    return DelovniNalogGetSerializer

class DelovniNalogMaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DelovniNalogMaterial.objects.all()
    serializer_class = DelovniNalogMaterialSerializer
