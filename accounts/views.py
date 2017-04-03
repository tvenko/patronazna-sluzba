from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, status, request, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.models import *
from accounts.serializers import *


def index(request):
    return HttpResponse("Hello, world. You're at the accounts index.")

class UporabnikViewSet(viewsets.ModelViewSet):
    queryset = Uporabnik.objects.all()
    serializer_class = UporabnikSerializer

class DelavciViewSet(viewsets.ModelViewSet):
    queryset = Delavec.objects.all()
    serializer_class = DelavecSerializer

class VrstaDelavcaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VrstaDelavca.objects.all()
    serializer_class = VrstaDelavcaSerializer

class UstanoveViewSet(viewsets.ModelViewSet):
    queryset = SifraUstanove.objects.all()
    serializer_class = UstanoveSerializer