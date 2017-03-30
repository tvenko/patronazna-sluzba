from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.models import Uporabnik, Delavec
from accounts.serializers import *


def index(request):
    return HttpResponse("Hello, world. You're at the accounts index.")

#@csrf_exempt #omogoca da posljes brez csrf tokna
#class UporabnikSeznam(APIView):
#
#    def get(self, request, format=None):
#        uporabniki = Uporabnik.objects.all()
#        serializer = UporabnikSerializer(uporabniki, many=True)
#        return Response(serializer.data)
#
#    def post(self, request, format=None):
#        serializer = UporabnikSerializer(data=request.data)
#        if serializer.is_valid():
#            serializer.save()
#            return Response(serializer.data, status=status.HTTP_201_CREATED)
#        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#tole je identicna koda oni kodi zgoraj -> v generics.<> so implementirani vsi taki razredi
class UporabnikSeznam(generics.ListCreateAPIView):
    """
        Razred, ki implementira metodi get in post za uporabnika
        get - vrne seznam vseh uporabnikov
        post - ustvaris novega uporabnika
    """
    queryset = Uporabnik.objects.all()
    serializer_class = UporabnikSerializer

class UporabnikPodrobno(generics.RetrieveUpdateAPIView):
    """
        Razred, ki implementira metodi get in update
        get - vrne uporabnik za podani id
        update - posodobi uporabnika za podani id
    """
    queryset = Uporabnik.objects.all()
    serializer_class = UporabnikSerializer

#post ne dela, ker se ne znam naredit da bo najprej kreiralo uporabnika in potem se delavca
class DelavciSeznam(generics.ListCreateAPIView):
    """
        Razred, ki implementira metodi get in post
        get - vrne seznam vseh delavcev
        post - ustvari novega delavca
    """
    queryset = Delavec.objects.all()
    serializer_class = DelavecSerializer

class DelavecPodrobno(generics.RetrieveUpdateDestroyAPIView):
    """
        Razred, ki implementira metodi get, update in delete
        get - vrne uporabnik za podani id
        delete - zbrise delavca za podani id
        update - posodobi delavca za podani id
    """
    queryset = Delavec.objects.all()
    serializer_class = DelavecSerializer

    #def perform_create(self, serializer):
    #    serializer.save(uporabnik=)