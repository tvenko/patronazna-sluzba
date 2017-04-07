from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from rest_framework.exceptions import NotAuthenticated

from delovniNalog.models import *

class DelovniNalogMaterialSerializer(serializers.HyperlinkedModelSerializer):

    id_delovni_nalog = serializers.HyperlinkedRelatedField(view_name='delovni_nalog-detail', read_only=True)

    class Meta:
        model = DelovniNalogMaterial
        fields = ('id_delovni_nalog', 'id_materiala', 'kolicina',)

class DelovniNalogSerializer(serializers.HyperlinkedModelSerializer):

    vrsta_obiska = serializers.PrimaryKeyRelatedField(source='vrsta_obiska.opis', read_only=True)
    material = DelovniNalogMaterialSerializer(source='delovninalogmaterial_set', many=True)

    class Meta:
        model = DelovniNalog

        #ne znam vkljucit bolezni ki ima za pk charfield
        fields = ('id', 'datum_prvega_obiska', 'je_obvezen_datum', 'stevilo_obiskov', 'casovni_interval',
                  'casovno_obdobje', 'sifra_zdravnika', 'id_pacienta', 'sifra_zdravila',
                  'material', 'vrsta_obiska', 'patronazna_sestra')

    def create(self, validated_data):
        print("----CHECK-----")
        print(validated_data)
        if (validated_data['sifra_zdravnika'].vrsta_delavca.naziv == "zdravnik"):
            print('je zdravnik!!!')
            #material = validated_data.pop('id_materiala')
            #pacinti = validated_data.pop('id_pacienta')
            #print('material', material)
            #print('pacienti = ', pacinti)
            print('validated data = ', validated_data)
            #delovniNalog = super(DelovniNalogSerializer, self).create(validated_data)
            delovniNalog = DelovniNalog.objects.create(**validated_data)
            #for pacient in pacinti:
            #    d = dict(pacient)
            #    Pacient.objects.create(delovninalog=delovniNalog, pacient=d['pacient'])
            print('----------------------')
            return delovniNalog
        else:
            print('ni zdravnik!!!')
            return NotAuthenticated(detail=None, code=None)


class VrstaObiskaSerializer(serializers.ModelSerializer):

    class Meta:
        model = VrstaObiska
        fields = ('id', 'opis', 'material', 'vezani_pacienti')

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