from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from delovniNalog.models import *

class DelovninalogSerializer(serializers.HyperlinkedModelSerializer):

    vrsta_obiska = serializers.PrimaryKeyRelatedField(source='vrsta_obiska.opis', read_only=True)

    class Meta:
        model = DelovniNalog

        #ne znam vkljucit bolezni ki ima za pk charfield
        fields = ('id', 'datum_prvega_obiska', 'je_obvezen_datum', 'stevilo_obiskov', 'casovni_interval',
                  'casovno_obdobje', 'sifra_zdravnika', 'id_pacienta', 'sifra_zdravila', 'id_materiala',
                   'vrsta_obiska', 'patronazna_sestra')

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