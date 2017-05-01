from rest_framework import serializers
from .models import *
from accounts.models import Uporabnik, Delavec, Pacient
from rest_framework.exceptions import ParseError

class MeritveNaObiskuSerializer(serializers.ModelSerializer):

    class Meta:
        model = MeritveNaObisku
        fields = '__all__'


class ObiskSerializer(serializers.ModelSerializer):

    pacient = serializers.PrimaryKeyRelatedField(source='delovni_nalog.id_pacienta', many=True, read_only=True)
    material = serializers.PrimaryKeyRelatedField(source='delovni_nalog.id_materiala', many=True, read_only=True)

    class Meta:
        model = Obisk
        fields = ('id', 'patronazna_sestra', 'predvideni_datum', 'dejanski_datum', 'delovni_nalog', 'je_obvezen_datum',
                  'id_meritev', 'nadomestna_patronazna_sestra', 'je_opravljen', 'pacient', 'material')

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
