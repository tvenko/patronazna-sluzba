from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from accounts.models import *

class UporabnikSerializer(serializers.ModelSerializer):
    """
    Razred, ki serializira objekt Uporabnik v JSON
    """

    class Meta:
        model = Uporabnik
        fields = ('id', 'ime', 'priimek', 'email', 'password', 'tel')
        write_only_fields = ('password', 'id')
        read_only_fields = ('last_login', 'je_admin')

    def create(self, validated_data):
        return Uporabnik(**validated_data)

class DelavecSerializer(serializers.HyperlinkedModelSerializer):
    """
        Razred, ki serializira objekt Delavec v JSON
    """

    uporabnik = serializers.PrimaryKeyRelatedField(read_only=True)
    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    email = serializers.EmailField(source='uporabnik.email')
    tel = serializers.CharField(source='uporabnik.tel')
    sifra_ustanove = serializers.HyperlinkedRelatedField(view_name='ustanova-podrobno', read_only=True)
    naziv_ustanove = serializers.CharField(source='sifra_ustanove.naziv')
    vrsta_delavca = serializers.HyperlinkedRelatedField(view_name='vrstadelavca-podrobno', read_only=True)
    naziv_delavca = serializers.CharField(source='vrsta_delavca.naziv')

    class Meta:
        model = Delavec
        fields = ('uporabnik', 'ime', 'priimek', 'email', 'tel', 'osebna_sifra', 'sifra_ustanove', 'naziv_ustanove', 'vrsta_delavca', 'naziv_delavca')

    def create(self, validated_data):
        """
            Metoda, ki ustvari nov objekt Uporabnika in Delavca, ko preko RESTa, dostopamo do /uporabniki/delavci POST
        :param validated_data: podatki, ki jih dobimo iz klica v JSON obliki
        :return: nov objekt delavca
        """
        # iz JSONa vzamemo podatke o uporabniku
        uporabnik_data = validated_data.pop('uporabnik', None)
        # iz JSONa vzamemo podatke o ustanovi in jo po nazivu posicemo v bazi
        ustanova = SifraUstanove.objects.get(naziv =  validated_data.pop('sifra_ustanove', None)['naziv'])
        # iz JSONa vzamemo podatke o vrsti delavca in jo po nazivu posicemo v bazi
        vrsta_delavca = VrstaDelavca.objects.get(naziv = validated_data.pop('vrsta_delavca', None)['naziv'])
        # iz JSONa razberemo se osebno sifro
        osebna_sifra = validated_data['osebna_sifra']
        # klicemo metodo create v razredu UporabnikSerializer, ki ustvari novega uporabnika
        uporabnik = UporabnikSerializer.create(UporabnikSerializer, uporabnik_data)
        uporabnik.save()
        # na novo sestavimo podatke v JSON obliki, ki jih potrebuje DelavecSerializer da ustvari novega delavca
        validated_data = {'uporabnik': uporabnik, 'osebna_sifra': osebna_sifra, 'sifra_ustanove': ustanova, 'vrsta_delavca': vrsta_delavca}
        #ustvarimo novega delavca
        delavec = super(DelavecSerializer, self).create(validated_data)
        return delavec

    #to se ne dela prav
    def update(self, instance, validated_data):
        uporabnik_data = validated_data.pop('Uporabnik', None)
        self.create_or_update_profile(instance, uporabnik_data)
        return super(DelavecSerializer, self).update(instance, validated_data)

    #to sm sam od nekod prekopirau...
    def create_or_update_delavec(self, delavec, uporabnik_data):
        uporabnik, created = Uporabnik.objects.get_or_create(user=delavec, defaults=uporabnik_data)
        if not created and uporabnik_data is not None:
            super(DelavecSerializer, self).update(uporabnik, uporabnik_data)

class VrstaDelavcaSerializer(serializers.ModelSerializer):
    """
        Razred, ki serializira objekt VrstaDelavca v JSON
    """
    class Meta:
        model = VrstaDelavca
        fields = ('sifra', 'naziv')

class UstanoveSerializer(serializers.ModelSerializer):
    """
        Razred, ki serializira objekt SifraUstanove v JSON
    """
    class Meta:
        model = SifraUstanove
        fields = ('id', 'naziv')