from rest_framework import serializers
from .models import *
from accounts.models import Uporabnik, Delavec
from rest_framework.exceptions import ParseError

class ObiskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Obisk
        fields = ('id', 'patronazna_sestra', 'predvideni_datum', 'dejanski_datum', 'delovni_nalog', 'je_obvezen_datum',
                  'id_meritev', 'nadomestna_patronazna_sestra', 'je_opravljen')

    def create(self, validated_data):
        obisk = Obisk(**validated_data)
        obisk.save()
        print(obisk)
        return obisk

class ObiskUpdateSerializer(serializers.ModelSerializer):

    patronaznaSestra = serializers.PrimaryKeyRelatedField(queryset=Uporabnik.objects.all(), required=False, source='patronazna_sestra')
    dejanskiDatum = serializers.DateField(required=False, source='dejanski_datum')
    # TODO dodaj se update za meritev in njeno vrednost
    #idMeritve = serializers.PrimaryKeyRelatedField(read_only=True, required=False, source='Meritev.id')
    #vrednostMeritve = serializers.CharField(required=False, source='MeritveNaObisku.vrednost')
    nadomestnaPatronaznaSestra = serializers.PrimaryKeyRelatedField(queryset=Uporabnik.objects.all(), required=False, source='nadomestna_patronazna_sestra')
    jeOpravljen = serializers.BooleanField(required=False, source='je_opravljen')

    class Meta:
        model = Obisk
        fields = ('patronaznaSestra', 'dejanskiDatum', 'nadomestnaPatronaznaSestra', 'jeOpravljen')

    def update(self, obisk, validated_data):
        print('data: ', validated_data)
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
        obisk.save()
        return obisk

class MeritevSeializer(serializers.ModelSerializer):

    class Meta:
        model = Meritev
        fields = '__all__'
