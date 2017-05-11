from django.http import HttpResponse
from rest_framework import viewsets, permissions
from accounts.permissions import IsAdminOrReadAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from accounts.serializers import *


def index(request):
    return HttpResponse("Deluje! Nahajate se na API od aplikacije Patronazna sestra.")

class UporabnikViewSet(viewsets.ModelViewSet):
    #permission_classes = (permissions.IsAdminUser,)
    #permission_classes = (IsAuthenticated,)
    queryset = Uporabnik.objects.all()
    def get_serializer_class(self):
	    if self.request.method == 'PUT':
		    return PosodobiGesloUporabnikaSerializer
	    if self.request.method == 'PATCH':
		    return PosodobiDatumUporabnikaSerializer
	    return UporabnikSerializer

class DelavciViewSet(viewsets.ModelViewSet):
    #permission_classes = (IsAdminOrReadAuthenticated,)
    serializer_class = DelavecSerializer

    def get_queryset(self):
        """
        Vrne delavca, ce je v URL napisan id uporabnika
        """
        queryset = Delavec.objects.all()
        uporabnik = self.request.query_params.get('uporabnik', None)
        if uporabnik is not None:
            queryset = Delavec.objects.filter(uporabnik_id=uporabnik)
        # dobi vrsto delavca ?vd=
        vrstaDelavca = self.request.query_params.get('vd', None)
        if vrstaDelavca is not None:
            queryset = Delavec.objects.filter(vrsta_delavca=vrstaDelavca)
        zdravniki = self.request.query_params.get('q1', None)
        if zdravniki is not None:
            queryset = Delavec.objects.filter(Q(vrsta_delavca=1) &
                (Q(uporabnik__ime__icontains=zdravniki) |
                Q(uporabnik__priimek__icontains=zdravniki))
            )
        sestre = self.request.query_params.get('q2', None)
        if sestre is not None:
            queryset = Delavec.objects.filter(Q(vrsta_delavca=3) &
                (Q(uporabnik__ime__icontains=sestre) |
                Q(uporabnik__priimek__icontains=sestre))
            )
        return queryset

class VezaniPacientiViewSet(viewsets.ModelViewSet):
    serializer_class = VezaniPacientSerializer

    def get_queryset(self):
        """
        Vrne vse vezane paciente za dolocenega uporabnika
        """
        queryset = VezaniPacient.objects.all()
        skrbnik = self.request.query_params.get('skrbnik', None)
        if skrbnik is not None:
            queryset = VezaniPacient.objects.filter(pacient_skrbnik=skrbnik);
        return queryset

class PacientiViewSet(viewsets.ModelViewSet):

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PacientPostSerializer
        return PacientGetSerializer

    def get_queryset(self):
        """
        Vrne pacienta, ce je v URL napisan id uporabnika
        """
        queryset = Pacient.objects.all()
        pacient = self.request.query_params.get('uporabnik', None)
        query = self.request.query_params.get('q', None)
        if pacient is not None:
            queryset = Pacient.objects.filter(uporabnik_id=pacient)
        # Query po poljih: ime, priimek, st_kartice, neznam drugace kot da
        # napisem kombinacije po katerih lahko pride?
        if query is not None:
            if len(query.split()) > 1:
                query = query.split()
                queryset = Pacient.objects.filter(
                    Q(uporabnik__ime__icontains=query) |
                    Q(uporabnik__priimek__icontains=query) |
                    Q(uporabnik__ime__icontains=query[0]) & Q(uporabnik__priimek__icontains=query[1]) |
                    Q(uporabnik__priimek__icontains=query[0]) & Q(uporabnik__ime__icontains=query[1]) |
                    Q(st_kartice__icontains=query)
                )
            else:
                queryset = Pacient.objects.filter(
                    Q(uporabnik__ime__icontains=query) |
                    Q(uporabnik__priimek__icontains=query) |
                    Q(st_kartice__icontains=query)
                )
        return queryset


class VrstaDelavcaViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = VrstaDelavca.objects.all()
    serializer_class = VrstaDelavcaSerializer

class UstanoveViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = SifraUstanove.objects.all()
    serializer_class = UstanoveSerializer

class KontaktnaOsebaViewSet(viewsets.ModelViewSet):
    queryset = KontaktnaOseba.objects.all()
    serializer_class =  KontaktnaOsebaSerializer

class SifraOkolisaViewSet(viewsets.ModelViewSet):
    queryset = SifraOkolisa.objects.all()
    serializer_class = SifrakolisaSerializer

class KadrovskaDelavecViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KadrovskaDelavec.objects.all()
    serializer_class = KadrovkaDelavcSerializer

class PotrditevRegistracijeViewSet(viewsets.ModelViewSet):
    queryset = Pacient.objects.all()
    serializer_class = PotrditevRegistracijeSerializer

class PostaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Posta.objects.all()
    serializer_class = PostaSerializer
    pagination_class = None

class SorodstvenoRazmerjeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SorodstvenoRazmerje.objects.all()
    serializer_class = SorodstvenoRazmerjeSerializer
    pagination_class = None
