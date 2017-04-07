from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from rest_framework.exceptions import NotAuthenticated, ParseError

from delovniNalog.models import *

class DelovniNalogMaterialSerializer(serializers.HyperlinkedModelSerializer):

    id_delovni_nalog = serializers.HyperlinkedRelatedField(view_name='delovni_nalog-detail', read_only=True)
    id_materiala = serializers.HyperlinkedRelatedField(view_name='material-detail', read_only=True)

    class Meta:
        model = DelovniNalogMaterial
        fields = ('id_delovni_nalog', 'id_materiala', 'kolicina',)

class DelovniNalogGetSerializer(serializers.HyperlinkedModelSerializer):

    vrsta_obiska = serializers.PrimaryKeyRelatedField(source='vrsta_obiska.opis', read_only=True)
    material = DelovniNalogMaterialSerializer(source='delovninalogmaterial_set', many=True)

    class Meta:
        model = DelovniNalog

        #ne znam vkljucit bolezni ki ima za pk charfield
        fields = ('id', 'datum_prvega_obiska', 'je_obvezen_datum', 'stevilo_obiskov', 'casovni_interval',
                  'casovno_obdobje', 'sifra_zdravnika', 'id_pacienta', 'sifra_zdravila',
                  'material', 'vrsta_obiska', 'patronazna_sestra')

class DelovniNalogPostSerializer(serializers.ModelSerializer):

    #material = DelovniNalogMaterialSerializer(source='delovninalogmaterial_set', many=True, read_only=True)
    kolicinaMateriala = serializers.IntegerField(source='id_materiala.kolicina', required=False)
    material = serializers.IntegerField(source='id_materiala.id_materiala', required=False)

    class Meta:
        model = DelovniNalog

        #ne znam vkljucit bolezni ki ima za pk charfield
        fields = ('id', 'datum_prvega_obiska', 'je_obvezen_datum', 'stevilo_obiskov', 'casovni_interval',
                  'casovno_obdobje', 'sifra_zdravnika', 'id_pacienta', 'sifra_zdravila',
                   'vrsta_obiska', 'patronazna_sestra', 'kolicinaMateriala', 'id_materiala', 'material')

    def create(self, validated_data):
        print(validated_data.keys())
        if (validated_data['sifra_zdravnika'].vrsta_delavca.naziv == "vodja PS" or validated_data['sifra_zdravnika'].vrsta_delavca.naziv == "zdravnik"):
            if (validated_data['sifra_zdravnika'].vrsta_delavca.naziv == "vodja PS"):
                if (validated_data['vrsta_obiska'].opis == "kontrola zdravstvenega stanja" or
                    validated_data['vrsta_obiska'].opis == "aplikacija injekcij" or
                    validated_data['vrsta_obiska'].opis == "odvzem krvi"):
                    return NotAuthenticated(detail='Niste prijavljeni kot zdravnik', code=401)
            if ('casovni_interval' in validated_data.keys()):
                delovniNalog = DelovniNalog(
                    sifra_zdravnika=validated_data['sifra_zdravnika'],
                    vrsta_obiska=validated_data['vrsta_obiska'],
                    datum_prvega_obiska=validated_data['datum_prvega_obiska'],
                    je_obvezen_datum=validated_data['je_obvezen_datum'],
                    stevilo_obiskov=validated_data['stevilo_obiskov'],
                    casovni_interval=validated_data['casovni_interval']
                )
            elif ('casovno_obdobje' in validated_data.keys()):
                delovniNalog = DelovniNalog(
                    sifra_zdravnika=validated_data['sifra_zdravnika'],
                    vrsta_obiska=validated_data['vrsta_obiska'],
                    datum_prvega_obiska=validated_data['datum_prvega_obiska'],
                    je_obvezen_datum=validated_data['je_obvezen_datum'],
                    stevilo_obiskov=validated_data['stevilo_obiskov'],
                    casovno_obdobje=validated_data['casovno_obdobje']
                )
            else:
                return ParseError()
            delovniNalog.save()
            delovniNalog.id_pacienta = validated_data['id_pacienta']
            if ('sifra_zdravila' in validated_data.keys()):
                delovniNalog.sifra_zdravila = validated_data['sifra_zdravila']

            #priredi MS delovnemu nalogu
            okolis_pacient = validated_data.pop('id_pacienta')[0].sifra_okolisa
            if(Delavec.objects.get(sifra_okolisa = okolis_pacient)):
                sestra = Delavec.objects.get(sifra_okolisa = okolis_pacient)
                delovniNalog.patronazna_sestra = sestra.uporabnik

            #tale kos kode ne dela, noce poslat id_materiala in kolicine materiala
            if(False and 'materiala' in validated_data.keys()):
                print('----SMO NOT-----')
                material = DelovniNalogMaterial(
                    id_delovni_nalog = delovniNalog.id,
                    id_materiala = validated_data['id_materiala'],
                    kolicina = validated_data['kolicinaMateriala']
                )
                material.save()
                print(material)
                delovniNalog.id_materiala = material.objects.get(id)
            return delovniNalog
        else:
            print('ni zdravnik!!!')
            return NotAuthenticated(detail='Niste prijavljeni kot zdravnik', code=401)


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