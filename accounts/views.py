from django.http import HttpResponse
from rest_framework import viewsets, permissions
from accounts.permissions import IsAdminOrReadAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import detail_route

from accounts.serializers import *


def index(request):
    return HttpResponse("Deluje! Nahajate se na API od aplikacije Patronažna sestra.")

class UporabnikViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAdminUser,)
    queryset = Uporabnik.objects.all()
    serializer_class = UporabnikSerializer

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
        uporabnik = self.request.query_params.get('uporabnik', None)
        if uporabnik is not None:
            queryset = Pacient.objects.filter(uporabnik_id=uporabnik)
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
