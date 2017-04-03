from django.http import HttpResponse
from rest_framework import viewsets, permissions

from accounts.serializers import *


def index(request):
    return HttpResponse("Hello, world. You're at the accounts index.")

class UporabnikViewSet(viewsets.ModelViewSet):
    queryset = Uporabnik.objects.all()
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = UporabnikSerializer

class DelavciViewSet(viewsets.ModelViewSet):
    queryset = Delavec.objects.all()
    permission_class = permissions.IsAuthenticated
    serializer_class = DelavecSerializer

class PacientiViewSet(viewsets.ModelViewSet):
    queryset = Pacient.objects.all()
    serializer_class = PacientSerializer

class VrstaDelavcaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VrstaDelavca.objects.all()
    permission_class = permissions.IsAuthenticated
    serializer_class = VrstaDelavcaSerializer

class UstanoveViewSet(viewsets.ModelViewSet):
    queryset = SifraUstanove.objects.all()
    permission_class = permissions.IsAuthenticated
    serializer_class = UstanoveSerializer