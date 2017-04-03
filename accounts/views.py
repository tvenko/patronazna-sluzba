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
    serializer_class = PacientSerializer

class VrstaDelavcaViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = VrstaDelavca.objects.all()
    serializer_class = VrstaDelavcaSerializer

class UstanoveViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = SifraUstanove.objects.all()
    serializer_class = UstanoveSerializer