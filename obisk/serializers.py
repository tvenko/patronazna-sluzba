from rest_framework import serializers
from .models import *

class ObiskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Obisk
        fields = ('id', 'patronazna_sestra', 'datum', 'je_obvezen_datum')

    def create(self, validated_data):
        obisk = Obisk(**validated_data)
        obisk.save()
        print(obisk)
        return obisk