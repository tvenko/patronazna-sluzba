from rest_framework import serializers
from .models import *
from accounts.models import Uporabnik, Delavec, Pacient
from accounts.serializers import PacientObiskSerializer, DelavecObiskSerializer, VezaniPacientSerializer
import delovniNalog.models
import accounts.models
from django.utils import timezone
from dateutil.parser import parse

class MaterialSerializer(serializers.ModelSerializer):

    class Meta:
        model = delovniNalog.models.Material
        fields = ('opis', )

class MeritveNaObiskuSerializer(serializers.ModelSerializer):

    class Meta:
        model = MeritveNaObisku
        fields = '__all__'

class MeritveNaObiskuPostSerializer(serializers.ModelSerializer):

    id_obisk = serializers.PrimaryKeyRelatedField(many=True, queryset=Obisk.objects.all())
    id_meritve = serializers.PrimaryKeyRelatedField(many=True, queryset=Meritev.objects.all())
    vrednost = serializers.ListField(child=serializers.CharField(min_length=0))

    class Meta:
        model = MeritveNaObisku
        fields = ('id_obisk', 'id_meritve', 'vrednost')

    def create(self, validated_data):
        vrednosti = []
        obiski = []
        meritve = []
        for e in validated_data['vrednost']:
            vrednosti.append(e)
        for e in validated_data['id_obisk']:
            obiski.append(e)
        for e in validated_data['id_meritve']:
            meritve.append(e)
        # print('vrednosti: ', vrednosti, '\n obiski: ', obiski, '\n meritve: ', meritve)
        for i in range (0, len(meritve)):
            meritevNaObisku = MeritveNaObisku(
                id_obisk = obiski[i],
                id_meritve = meritve[i],
                vrednost = vrednosti[i]
            )
            meritevNaObisku.save()
        return validated_data

class ObiskDnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Obisk
        fields = ('id', 'je_opravljen')

class ObiskSerializer(serializers.ModelSerializer):

    pacient = PacientObiskSerializer(source='delovni_nalog.id_pacienta')
    material = MaterialSerializer(source='delovni_nalog.id_materiala', many=True)
    vrstaObiskaId = serializers.PrimaryKeyRelatedField(source='delovni_nalog.vrsta_obiska', read_only=True)
    vrstaObiska = serializers.PrimaryKeyRelatedField(source='delovni_nalog.vrsta_obiska.opis', read_only=True)
    zdravnik = DelavecObiskSerializer(source='delovni_nalog.sifra_zdravnika')
    vezani_pacienti = serializers.PrimaryKeyRelatedField(source='delovni_nalog.vezani_pacienti', many=True, read_only=True)

    class Meta:
        model = Obisk
        fields = ('id', 'patronazna_sestra', 'predvideni_datum', 'dejanski_datum', 'delovni_nalog', 'je_obvezen_datum',
                  'id_meritev', 'nadomestna_patronazna_sestra', 'je_opravljen', 'pacient', 'material', 'vrstaObiskaId',
                  'vrstaObiska', 'zdravnik', 'vezani_pacienti')

    def create(self, validated_data):
        obisk = Obisk(**validated_data)
        obisk.save()
        return obisk

class ObiskUpdateSerializer(serializers.ModelSerializer):

    patronaznaSestra = serializers.PrimaryKeyRelatedField(queryset=Uporabnik.objects.all(), required=False, source='patronazna_sestra')
    dejanskiDatum = serializers.DateTimeField(required=False, source='dejanski_datum')
    meritev = MeritveNaObiskuSerializer(source='meritevnaobisku_set', many=True,  required=False)
    nadomestnaPatronaznaSestra = serializers.PrimaryKeyRelatedField(queryset=Uporabnik.objects.all(), required=False, source='nadomestna_patronazna_sestra')
    jeOpravljen = serializers.BooleanField(required=False, source='je_opravljen')

    class Meta:
        model = Obisk
        fields = ('patronaznaSestra', 'dejanskiDatum', 'nadomestnaPatronaznaSestra', 'jeOpravljen', 'meritev')

    def update(self, obisk, validated_data):
        #print('data: ', validated_data)
        if ('patronazna_sestra' in validated_data.keys()):
            sestra = Delavec.objects.get(uporabnik = validated_data['patronazna_sestra'])
            if (sestra.vrsta_delavca.naziv == 'patronažna sestra'):
                obisk.patronazna_sestra = validated_data['patronazna_sestra']
            # TODO vrni custom error
        if ('dejanski_datum' in validated_data.keys()):
            obisk.dejanski_datum = validated_data['dejanski_datum']
        if ('nadomestna_patronazna_sestra' in validated_data.keys()):
            nadomestna_sestra = Delavec.objects.get(uporabnik=validated_data['nadomestna_patronazna_sestra'])
            if (nadomestna_sestra.vrsta_delavca.naziv == 'patronažna sestra'):
                if (validated_data['nadomestna_patronazna_sestra'] != obisk.patronazna_sestra):
                    obisk.nadomestna_patronazna_sestra = validated_data['nadomestna_patronazna_sestra']
                # TODO vrni custom error
            # TODO vrni custom error
        if ('je_opravljen' in validated_data.keys()):
            obisk.je_opravljen = validated_data['je_opravljen']
        if ('meritevnaobisku_set' in validated_data.keys()):
            for meritev in validated_data['meritevnaobisku_set']:
                m = meritev['id_meritve']
                if (m.sp_meja and m.zg_meja):
                    if (int(meritev['vrednost']) > m.sp_meja and int(meritev['vrednost']) < m.zg_meja):
                        novaMeritev = MeritveNaObisku(
                            id_obisk = obisk,
                            id_meritve = meritev['id_meritve'],
                            vrednost = meritev['vrednost'],
                        )
                        novaMeritev.save()
                    else:
                        print('ni v mejah')
                        # TODO vrni custom error
                else:
                    novaMeritev = MeritveNaObisku(
                        id_obisk=obisk,
                        id_meritve=meritev['id_meritve'],
                        vrednost=meritev['vrednost'],
                    )
                    novaMeritev.save()
        obisk.save()
        return obisk

class MeritevSeializer(serializers.ModelSerializer):

    class Meta:
        model = Meritev
        fields = '__all__'

class ObiskDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Obisk
        fields = ('predvideni_datum', 'dejanski_datum', 'je_opravljen', 'je_obvezen_datum',
        'nadomestna_patronazna_sestra', 'id_meritev')

class ObiskNadomescajSerializer(serializers.ModelSerializer):

    def update(self, instance, validated_data):
        print("NOTRI\n\n")
        print(validated_data)
        print("\n\n")
        zacetek_nadomescanja = parse(validated_data['zacetek_nadomescanja'])
        konec_nadomescanja = parse(validated_data['konec_nadomescanja'])
        obiski_za_nadomescat = ObiskNadomescajSerializer.objects.filter(nadomestna_patronazna_sestra=validated_data['nadomestna_patronazna_sestra'],)



    def to_internal_value(self, data):
        internal_value = super(ObiskNadomescajSerializer, self).to_internal_value(data)
        zacetek_nadomescanja_raw_value = data.get("zacetek_nadomescanja")
        konec_nadomescanja_raw_value = data.get("konec_nadomescanja")
        internal_value.update({
            "zacetek_nadomescanja": zacetek_nadomescanja_raw_value,
            "konec_nadomescanja": konec_nadomescanja_raw_value
        })
        return internal_value

    class Meta:
        model = Obisk
        fields = '__all__'
