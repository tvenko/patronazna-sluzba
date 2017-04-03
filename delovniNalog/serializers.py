from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from delovniNalog.models import *

class VrstaObiskaSerializer(serializers.ModelSerializer):

    class Meta:
        model = VrstaObiska
        fields = ('id', 'opis')

class BolezenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bolezen
        fields = ('sifra', 'opis')

class MaterialSerializer(serializers.ModelSerializer):

    class Meta:
        model = Material
        fields = ('id', 'opis')

class ZdraviloSerializer(serializers.ModelSerializer):

    class Meta:
        model = Zdravilo
        fields = ('sifra', 'naziv', 'opis')