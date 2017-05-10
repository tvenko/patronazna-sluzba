from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import *
from django.utils import timezone
from django.db.models import Q

class ObiskViewSet(viewsets.ModelViewSet):
    def filtriraj(self):
        if (self.delavec.vrsta_delavca.naziv == "patronažna sestra"):
            queryset = Obisk.objects.filter(Q(patronazna_sestra=self.delavec.uporabnik) | Q(nadomestna_patronazna_sestra=self.delavec.uporabnik)).order_by('predvideni_datum')
        elif (self.delavec.vrsta_delavca.naziv == "zdravnik"):
            dn = DelovniNalog.objects.filter(sifra_zdravnika=self.delavec)
            queryset = Obisk.objects.filter(delovni_nalog__in=dn).order_by('predvideni_datum')
        elif (self.delavec.vrsta_delavca.naziv == "vodja PS"):
            queryset = Obisk.objects.all().order_by('predvideni_datum')
        if (self.predvideni_datum):
            q = queryset.filter(predvideni_datum=self.datum)
            queryset = q
        elif (self.predvideni_zacetni_datum or self.predvideni_koncni_datum):
            if (self.predvideni_zacetni_datum and self.predvideni_koncni_datum):
                q = queryset.filter(predvideni_datum__range=[self.predvideni_zacetni_datum, self.predvideni_koncni_datum])
                queryset = q
            elif (self.predvideni_zacetni_datum):
                q = queryset.filter(predvideni_datum__range=[self.predvideni_zacetni_datum, '9999-12-31'])
                queryset = q
            else:
                q = queryset.filter(predvideni_datum__range=['0001-01-01', self.predvideni_koncni_datum])
                queryset = q
        if (self.dejanski_datum):
            q = queryset.filter(dejanski_datum=self.datum)
            queryset = q
        elif (self.dejanski_zacetni_datum or self.dejanski_koncni_datum):
            if (self.dejanski_zacetni_datum and self.dejanski_koncni_datum):
                q = queryset.filter(dejanski_datum__range=[self.dejanski_zacetni_datum, self.dejanski_koncni_datum])
                queryset = q
            elif (self.dejanski_zacetni_datum):
                q = queryset.filter(dejanski_datum__range=[self.dejanski_zacetni_datum, '9999-12-31'])
                queryset = q
            else:
                q = queryset.filter(dejanski_datum__range=['0001-01-01', self.dejanski_koncni_datum])
                queryset = q
        if (self.vrsta_obiska):
            dn = DelovniNalog.objects.filter(vrsta_obiska=self.vrsta_obiska)
            q = queryset.filter(delovni_nalog__in=dn)
            queryset = q
        if (self.izdajatelj):
            dn = DelovniNalog.objects.filter(sifra_zdravnika=self.izdajatelj)
            q = queryset.filter(delovni_nalog__in=dn)
            queryset = q
        if (self.pacient):
            dn = DelovniNalog.objects.filter(id_pacienta=self.pacient)
            q = queryset.filter(delovni_nalog__in=dn)
            queryset = q
        if (self.sestra):
            sestra = Delavec.objects.get(osebna_sifra=self.sestra)
            q = queryset.filter(patronazna_sestra=sestra.uporabnik)
            queryset = q
        if (self.nadomestna_sestra):
            sestra = Delavec.objects.get(osebna_sifra = self.nadomestna_sestra)
            q = queryset.filter(nadomestna_patronazna_sestra=sestra.uporabnik)
            queryset = q
        if (self.je_opravljen):
            q = queryset.filter(je_opravljen = self.je_opravljen)
            queryset = q;
        return queryset

    def get_queryset(self):
        """
        Vrne delovne naloge od vsakega delavca, vodja PS dobi vse
        """

        self.sifra_delavca = self.request.query_params.get('user')
        self.predvideni_datum = self.request.query_params.get('pdat')
        self.predvideni_zacetni_datum = self.request.query_params.get('zac_pdat')
        self.predvideni_koncni_datum = self.request.query_params.get('konc_pdat')
        self.dejanski_datum = self.request.query_params.get('ddat')
        self.dejanski_zacetni_datum = self.request.query_params.get('zac_ddat')
        self.dejanski_koncni_datum = self.request.query_params.get('konc_ddat')
        self.vrsta_obiska = self.request.query_params.get('vo')
        self.izdajatelj = self.request.query_params.get('izd')
        self.pacient = self.request.query_params.get('pac')
        self.sestra = self.request.query_params.get('ms')
        self.nadomestna_sestra = self.request.query_params.get('nms')
        self.je_opravljen = self.request.query_params.get('opr')

        #for development purpouse
        queryset = Obisk.objects.all()

        if (self.sifra_delavca):
            self.delavec = Delavec.objects.get(osebna_sifra = self.sifra_delavca)
            if (self.delavec):
                queryset = self.filtriraj()
        return queryset
    def get_serializer_class(self):
        if self.request.method == 'PUT':
            return ObiskUpdateSerializer
        return ObiskSerializer

class ObiskiPlaniraniViewSet(viewsets.ReadOnlyModelViewSet):

    pagination_class = None;
    serializer_class = ObiskSerializer
    def get_queryset(self):
        queryset = Obisk.objects.all();
        self.sifra_delavca = self.request.query_params.get('user')
        if (self.sifra_delavca):
            self.delavec = Delavec.objects.get(osebna_sifra = self.sifra_delavca)
            if (self.delavec):
                queryset = Obisk.objects.filter(
                    (Q(patronazna_sestra=self.delavec.uporabnik) | Q(nadomestna_patronazna_sestra=self.delavec.uporabnik))
                     & ((~Q(dejanski_datum = None) | Q(je_obvezen_datum = True)) & Q(je_opravljen = False)))\
                    .order_by('predvideni_datum')
        return queryset


class ObiskiPrihajajociViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = ObiskSerializer
    def get_queryset(self):
        queryset = Obisk.objects.all();
        self.sifra_delavca = self.request.query_params.get('user')
        if (self.sifra_delavca):
            self.delavec = Delavec.objects.get(osebna_sifra = self.sifra_delavca)
            if (self.delavec):
                queryset = Obisk.objects.filter(
                    (Q(patronazna_sestra=self.delavec.uporabnik) | Q(nadomestna_patronazna_sestra=self.delavec.uporabnik))
                     & (Q(dejanski_datum = None) & Q(je_obvezen_datum = False) & Q(je_opravljen = False)))\
                    .order_by('predvideni_datum')
        return queryset

class MeritevViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Meritev.objects.all()
    serializer_class = MeritevSeializer

class MeritveNaObiskuViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = MeritveNaObisku.objects.all()
	serializer_class = MeritveNaObiskuSerializer