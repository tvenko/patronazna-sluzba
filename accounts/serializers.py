from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from accounts.models import Uporabnik, Delavec, Pacient

class UporabnikSerializer(serializers.ModelSerializer):
    """
    Razred, ki serializira objekt Uporabnik v JSON
    """

    class Meta:
        model = Uporabnik
        fields = ('id', 'ime', 'priimek', 'email', 'password', 'tel')
        write_only_fields = ('password', 'id')
        read_only_fields = ('last_login', 'je_admin')

class DelavecSerializer(serializers.ModelSerializer):

    """
        Razred, ki serializira objekt Delavec v JSON
    """

    uporabnik = serializers.PrimaryKeyRelatedField(read_only=True, source='uporabnik.ime')
    sifra_ustanove = serializers.PrimaryKeyRelatedField(read_only=True, source='sifra_ustanove.naziv')
    vrsta_delavca = serializers.PrimaryKeyRelatedField(read_only=True, source='vrsta_delavca.naziv')

    class Meta:
        model = Delavec
        fields = ('uporabnik', 'osebna_sifra', 'sifra_ustanove', 'vrsta_delavca')