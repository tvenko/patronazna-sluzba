from django.shortcuts import render

from django.http import HttpResponse
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response

from accounts.models import Uporabnik, Delavec
#from accounts.permissions import IsAccountOwner
from accounts.serializers import DelavecSerializer


def index(request):
    return HttpResponse("Hello, world. You're at the accounts index.")

class RegistracijaDelavca(viewsets.ModelViewSet):

    lookup_field = 'email'
    queryset = Delavec.objects.all()
    serializer_class = DelavecSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Delavec.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)

