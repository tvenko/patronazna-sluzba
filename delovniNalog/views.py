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

    def filtriraj(self):
        if (self.delavec.vrsta_delavca.naziv == "patronažna sestra"):
            queryset = DelovniNalog.objects.filter(patronazna_sestra=self.delavec)
        elif (self.delavec.vrsta_delavca.naziv == "zdravnik"):
            queryset = DelovniNalog.objects.filter(sifra_zdravnika=self.delavec)
        elif (self.delavec.vrsta_delavca.naziv == "vodja PS"):
            queryset = DelovniNalog.objects.all()
        if (self.datum is not None):
            queryset.filter()

    def get_queryset(self):
        """
        Vrne delovne naloge od vsakega delavca, vodja PS dobi vse
        """

        self.sifra_delavca = self.request.query_params.get('user')
        self.datum = self.request.query_params.get('dat')
        self.zacetni_datum = self.request.query_params.get('zac_dat')
        self.koncni_datum = self.request.query_params.get('konc_dat')
        self.vrsta_obiska = self.request.query_params.get('vo')
        self.izdajatelj = self.request.query_params.get('izd')
        self.pacient = self.request.query_params.get('pac')
        self.sestra = self.request.query_params.get('ms')
        self.nadomestna_sestra = self.request.query_params.get('nms')

        if (self.sifra_delavca is not None):
            self.delavec = Delavec.objects.get(osebna_sifra = self.sifra_delavca)
            if (self.delavec is not None):
                if (delavec.vrsta_delavca.naziv == "patronažna sestra"):
                    self.filtriraj();
                    queryset = DelovniNalog.objects.filter(patronazna_sestra=delavec)
                elif (delavec.vrsta_delavca.naziv == "zdravnik"):
                    self.filtriraj();
                    queryset = DelovniNalog.objects.filter(sifra_zdravnika=delavec)
                elif (delavec.vrsta_delavca.naziv == "vodja PS"):
                    self.filtriraj();
                    queryset = DelovniNalog.objects.all()
        return queryset

class DelovniNalogMaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DelovniNalogMaterial.objects.all()
    serializer_class = DelovniNalogMaterialSerializer
