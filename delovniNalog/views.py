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
    serializer_class = DelovniNalogPostSerializer

    def get_queryset(self):
        """
        Vrne ddelovni nalog za dolocenega zdravnika
        """
        queryset = DelovniNalog.objects.all()
        zdravnik = self.request.query_params.get('sifra_zdravnika', None)
        if zdravnik is not None:
            queryset = DelovniNalog.objects.filter(sifra_zdravnika=zdravnik)
        return queryset
    #def get_serializer_class(self):
    #    if self.request.method == 'POST':
    #        return DelovniNalogPostSerializer
    #    return DelovniNalogGetSerializer

class DelovniNalogMaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DelovniNalogMaterial.objects.all()
    serializer_class = DelovniNalogMaterialSerializer
