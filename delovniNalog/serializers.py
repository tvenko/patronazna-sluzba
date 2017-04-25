from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from rest_framework.exceptions import NotAuthenticated, ParseError
from datetime import date
import datetime

from delovniNalog.models import *
from obisk.serializers import ObiskSerializer

class DelovniNalogMaterialSerializer(serializers.ModelSerializer):
    '''Serializira material delovnega naloga'''
    id_materiala = serializers.PrimaryKeyRelatedField(queryset=Material.objects.all())
    id_delovni_nalog = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = DelovniNalogMaterial
        fields = ('id_delovni_nalog', 'id_materiala', 'kolicina',)

class DelovniNalogGetSerializer(serializers.HyperlinkedModelSerializer):

    vrsta_obiska = serializers.PrimaryKeyRelatedField(source='vrsta_obiska.opis', read_only=True)
    material = DelovniNalogMaterialSerializer(source='delovninalogmaterial_set', many=True)

    class Meta:
        model = DelovniNalog

        fields = ('id', 'datum_prvega_obiska', 'je_obvezen_datum', 'stevilo_obiskov', 'casovni_interval',
                  'casovno_obdobje', 'sifra_zdravnika', 'id_pacienta', 'sifra_zdravila',
                  'material', 'vrsta_obiska', 'patronazna_sestra')

class DelovniNalogPostSerializer(serializers.ModelSerializer):

    material = DelovniNalogMaterialSerializer(source='delovninalogmaterial_set', many=True, required=False) #read_only=True

    class Meta:
        model = DelovniNalog

        fields = ('id', 'datum_prvega_obiska', 'je_obvezen_datum', 'stevilo_obiskov', 'casovni_interval',
                  'casovno_obdobje', 'sifra_zdravnika', 'id_pacienta', 'sifra_zdravila',
                   'vrsta_obiska', 'patronazna_sestra', 'material')

    #funkcija, ki izracuna datume in kreira zapise o Obiskih va bazo, ce je podan koncen datum
    def kreirajObiskObdobje(self, stObiskov, zacetniDatum, koncniDatum, patronaznaSestra, delovniNalog, jeObvezen = False):
        stDni = koncniDatum-zacetniDatum
        interval = int(stDni.days/stObiskov)
        datum = zacetniDatum
        for i in range(0, stObiskov):
            data = {'patronazna_sestra': patronaznaSestra, 'predvideni_datum': datum, 'je_obvezen_datum': jeObvezen,
                    'delovni_nalog': delovniNalog}
            ObiskSerializer.create(self, data)
            datum += datetime.timedelta(days=interval)
            if(datum.weekday() == 6):
                datum += datetime.timedelta(days=1)
            elif (datum.weekday() == 5):
                datum += datetime.timedelta(days=2)

    # funkcija, ki izracuna datume in kreira zapise o Obiskih va bazo, ce je podan interval med obiski
    def kreirajObiskInterval(self, stObiskov, zacetniDatum, interval, patronaznaSestra, delovniNalog, jeObvezen = False):
        datum = zacetniDatum
        for i in range(0, stObiskov):
            data = {'patronazna_sestra': patronaznaSestra, 'predvideni_datum': datum, 'je_obvezen_datum': jeObvezen,
                    'delovni_nalog': delovniNalog}
            ObiskSerializer.create(self, data)
            datum += datetime.timedelta(days=interval)
            if (datum.weekday() == 6):
                datum += datetime.timedelta(days=1)
            elif (datum.weekday() == 5):
                datum += datetime.timedelta(days=2)

    def create(self, validated_data):
        # TODO preveri z JWT tokenom ali je zdravnik, ne samo preko polja v body (!) to je lazje preverit z request.user??
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

            # (Popravljeno) doda material ce je bil poslan
            if('delovninalogmaterial_set' in validated_data.keys()):
                # Napisanih je vec materialov, vsak je v OrderedDict
                for material in validated_data['delovninalogmaterial_set']:
                    novi_material = DelovniNalogMaterial(
                        id_delovni_nalog = delovniNalog,
                        id_materiala = material['id_materiala'],
                        kolicina = material['kolicina']
                    )
                    novi_material.save()
                # Nevem ce je potrebna spodnja vrstica ?
                #delovniNalog.id_materiala = material.objects.get(id)

            #Kreira zapise o Obisku v bazo
            if ('casovno_obdobje' in validated_data.keys()):
                self.kreirajObiskObdobje(validated_data['stevilo_obiskov'], validated_data['datum_prvega_obiska'],
                                           validated_data['casovno_obdobje'], delovniNalog.patronazna_sestra,
                                           delovniNalog, validated_data['je_obvezen_datum'])
            elif('casovni_interval' in validated_data.keys()):
                self.kreirajObiskInterval(validated_data['stevilo_obiskov'], validated_data['datum_prvega_obiska'],
                                          validated_data['casovni_interval'], delovniNalog.patronazna_sestra,
                                          delovniNalog, validated_data['je_obvezen_datum'])
            else:
                print('se ni')

            return delovniNalog
        else:
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
