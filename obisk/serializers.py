from rest_framework import serializers
from .models import *

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