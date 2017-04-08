from django.http import HttpResponse
from rest_framework import viewsets, permissions
from accounts.permissions import IsAdminOrReadAuthenticated

from accounts.serializers import *


def index(request):
    return HttpResponse("Hello, world. You're at the accounts index.")

class UporabnikViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAdminUser,)
    queryset = Uporabnik.objects.all()
    serializer_class = UporabnikSerializer

class DelavciViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminOrReadAuthenticated,)
    queryset = Delavec.objects.all()
    serializer_class = DelavecSerializer

class PacientiViewSet(viewsets.ModelViewSet):
    queryset = Pacient.objects.all()
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PacientPostSerializer
        return PacientGetSerializer


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