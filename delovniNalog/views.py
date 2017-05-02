from django.shortcuts import render
from rest_framework import viewsets, permissions
from delovniNalog.serializers import *
from django.utils import timezone
from obisk.models import Obisk

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
            queryset = DelovniNalog.objects.filter(patronazna_sestra=self.delavec.uporabnik).order_by('datum_izdaje')
        elif (self.delavec.vrsta_delavca.naziv == "zdravnik"):
            queryset = DelovniNalog.objects.filter(sifra_zdravnika=self.delavec).order_by('datum_izdaje')
        elif (self.delavec.vrsta_delavca.naziv == "vodja PS"):
            queryset = DelovniNalog.objects.all().order_by('datum_izdaje')
        if (self.datum):
            q = queryset.filter(datum_izdaje=self.datum)
            queryset = q
        elif (self.zacetni_datum or self.koncni_datum):
            if (self.zacetni_datum and self.koncni_datum):
                q = queryset.filter(datum_izdaje__range=[self.zacetni_datum, self.koncni_datum])
                queryset = q
            elif (self.zacetni_datum):
                q = queryset.filter(datum_izdaje__range=[self.zacetni_datum, timezone.now()+timezone.timedelta(1)])
                queryset = q
            else:
                q = queryset.filter(datum_izdaje__range=['0001-01-01', self.koncni_datum])
                queryset = q
        if (self.vrsta_obiska):
            q = queryset.filter(vrsta_obiska=self.vrsta_obiska)
            queryset = q
        if (self.izdajatelj):
            q = queryset.filter(sifra_zdravnika=self.izdajatelj)
            queryset = q
        if (self.pacient):
            q = queryset.filter(id_pacienta=self.pacient)
            queryset = q
        if (self.sestra):
            sestra = Delavec.objects.get(osebna_sifra=self.sestra)
            q = queryset.filter(patronazna_sestra=sestra.uporabnik)
            queryset = q
        if (self.nadomestna_sestra):
            sestra = Delavec.objects.get(osebna_sifra = self.nadomestna_sestra)
            obisk = Obisk.objects.filter(nadomestna_patronazna_sestra=sestra.uporabnik)
            q = queryset.filter(obisk = obisk)
            queryset = q
        return queryset

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

        if (self.sifra_delavca):
            self.delavec = Delavec.objects.get(osebna_sifra = self.sifra_delavca)
            if (self.delavec):
                queryset = self.filtriraj()
        return queryset

class DelovniNalogMaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DelovniNalogMaterial.objects.all()
    serializer_class = DelovniNalogMaterialSerializer
