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
    serializer_class = DelovniNalogSerializer

    def get_queryset(self):
        """
        Vrne delovne naloge od vsakega delavca, vodja PS dobi vse
        """

        sifra_delavca = self.request.query_params.get('sifra_delavca', None)
        if (sifra_delavca is not None):
            delavec = Delavec.objects.get(osebna_sifra = sifra_delavca)
            if (delavec is not None):
                if (delavec.vrsta_delavca.naziv == "patronažna sestra"):
                    queryset = DelovniNalog.objects.filter(patronazna_sestra=delavec)
                elif (delavec.vrsta_delavca.naziv == "zdravnik"):
                    queryset = DelovniNalog.objects.filter(sifra_zdravnika=delavec)
                elif (delavec.vrsta_delavca.naziv == "vodja PS"):
                    queryset = DelovniNalog.objects.all()
        return queryset

class DelovniNalogMaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DelovniNalogMaterial.objects.all()
    serializer_class = DelovniNalogMaterialSerializer
