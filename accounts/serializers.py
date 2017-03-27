from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from accounts.models import Uporabnik, Delavec, Pacient

class DelavecSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Delavec
        fields = ('email', 'password', 'priimek', 'ime', 'tel', 'osebna_sifra', 'sifra_ustanove', 'vrsta_delavca')
        read_only_fields = ('last_login')

        def create(self, validated_date):
            return (Delavec.object.create(**validated_date))