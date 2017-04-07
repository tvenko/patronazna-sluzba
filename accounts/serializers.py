from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from accounts.models import *

class KontaktnaOsebaSerializer(serializers.ModelSerializer):

    sorodstveno_razmerje = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:

        model = KontaktnaOseba
        fields = ('ime', 'priimek', 'tel', 'sorodstveno_razmerje')

    def create(self, validated_data):
        kontaktnaOseba = KontaktnaOseba(**validated_data)
        kontaktnaOseba.save()
        return kontaktnaOseba

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
        uporabnik = Uporabnik(
            email = validated_data['email'],
            ime = validated_data['ime'],
            priimek = validated_data['priimek'],
            tel = validated_data['tel'],
        )
        uporabnik.set_password(validated_data['password'])
        uporabnik.save()
        return uporabnik

class DelavecSerializer(serializers.HyperlinkedModelSerializer):
    """
        Razred, ki serializira objekt Delavec v JSON
    """

    uporabnik = serializers.PrimaryKeyRelatedField(read_only=True)
    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    email = serializers.EmailField(source='uporabnik.email')
    tel = serializers.CharField(source='uporabnik.tel')
    password = serializers.CharField(source='uporabnik.password')
    sifra_ustanove = serializers.HyperlinkedRelatedField(view_name='ustanova-detail', read_only=True)
    naziv_ustanove = serializers.CharField(source='sifra_ustanove.naziv')
    vrsta_delavca = serializers.HyperlinkedRelatedField(view_name='vrstadelavca-detail', read_only=True)
    naziv_delavca = serializers.CharField(source='vrsta_delavca.naziv')
    sifra_okolisa = serializers.HyperlinkedRelatedField(view_name='sifra_okolisa-detail', read_only=True)
    naziv_okolisa = serializers.CharField(source='sifra_okolisa.naziv')

    class Meta:
        model = Delavec
        fields = ('uporabnik', 'ime', 'priimek', 'email', 'tel', 'password', 'osebna_sifra', 'sifra_ustanove',
                  'naziv_ustanove', 'vrsta_delavca', 'naziv_delavca', 'sifra_okolisa', 'naziv_okolisa')

    def create(self, validated_data):
        """
            Metoda, ki ustvari nov objekt Uporabnika in Delavca, ko preko RESTa, dostopamo do /uporabniki/delavci POST
        :param validated_data: podatki, ki jih dobimo iz klica v JSON obliki
        :return: nov objekt delavca
        """

        print(validated_data.keys())
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
        if ('sifra_okolisa' in validated_data.keys()):
            okolis = SifraOkolisa.objects.get(naziv = validated_data.pop('sifra_okolisa', None)['naziv'])
            validated_data = {'uporabnik': uporabnik, 'osebna_sifra': osebna_sifra, 'sifra_ustanove': ustanova,
                          'vrsta_delavca': vrsta_delavca, 'sifra_okolisa': okolis}
        else:
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


class PacientGetSerializer(serializers.ModelSerializer):
    """
        Razred, ki vraca podatke za Vezanega pacienta.
    """
    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    eposta = serializers.EmailField(source='uporabnik.email')
    telefon = serializers.CharField(source='uporabnik.tel')
    stevilkaPacienta = serializers.IntegerField(source='st_kartice')
    datumRojstva = serializers.DateField(source='datum_rojstva')
    posta = serializers.PrimaryKeyRelatedField(read_only=True)
    kraj = serializers.CharField(source='posta.kraj')
    kontaktnaOseba = serializers.PrimaryKeyRelatedField(read_only=True, source='kontaktna_oseba')
    hisnaStevilka = serializers.CharField(source='hisna_stevilka')

    class Meta:
        model = Pacient
        fields = ('ime', 'priimek', 'eposta', 'telefon', 'stevilkaPacienta',
                    'ulica', 'hisnaStevilka', 'posta', 'kraj',  'datumRojstva',
                    'kontaktnaOseba',)

class PacientGetSerializer(serializers.ModelSerializer):
    """
        Razred, ki vraca podatke za pacienta.
    """
    #uporabnik = serializers.PrimaryKeyRelatedField(read_only=True)
    vezaniPacienti = PacientGetSerializer(many=True, read_only=True, source='vezani_pacienti')
    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    eposta = serializers.EmailField(source='uporabnik.email')
    telefon = serializers.CharField(source='uporabnik.tel')
    stevilkaPacienta = serializers.IntegerField(source='st_kartice')
    datumRojstva = serializers.DateField(source='datum_rojstva')
    posta = serializers.PrimaryKeyRelatedField(read_only=True)
    kraj = serializers.CharField(source='posta.kraj')
    kontaktnaOseba = serializers.PrimaryKeyRelatedField(read_only=True, source='kontaktna_oseba')
    hisnaStevilka = serializers.CharField(source='hisna_stevilka')

    class Meta:
        model = Pacient
        fields = ('ime', 'priimek', 'eposta', 'telefon', 'stevilkaPacienta',
                  'ulica', 'hisnaStevilka', 'posta', 'kraj', 'datumRojstva',
                  'kontaktnaOseba', 'vezaniPacienti')

class PacientPostSerializer(serializers.ModelSerializer):
    """
        Razred, za kreiranje pacienta
    """

    uporabnik = serializers.PrimaryKeyRelatedField(read_only=True)
    #vezaniPacienti = PacientGetSerializer(many=True, read_only=True, source='vezani_pacienti')
    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    eposta = serializers.EmailField(source='uporabnik.email')
    password = serializers.CharField(source='uporabnik.password')
    telefon = serializers.CharField(source='uporabnik.tel')
    stevilkaPacienta = serializers.IntegerField(source='st_kartice')
    datumRojstva = serializers.DateField(source='datum_rojstva')
    posta = serializers.PrimaryKeyRelatedField(read_only=True)
    kraj = serializers.CharField(source='posta.kraj')
    kontaktnaOseba = serializers.PrimaryKeyRelatedField(read_only=True, source='kontaktna_oseba')
    kontaktIme = serializers.CharField(source='kontaktna_oseba.ime', required=False)
    kontaktPriimek = serializers.CharField(source='kontaktna_oseba.priimek', required=False)
    kontaktTelefon = serializers.CharField(source='kontaktna_oseba.tel', required=False)
    kontaktSorodstvo = serializers.CharField(source='kontaktna_oseba.sorodstveno_razmerje', required=False)
    hisnaStevilka = serializers.CharField(source='hisna_stevilka')


    class Meta:
        model = Pacient
        fields = ('uporabnik', 'ime', 'priimek', 'eposta', 'password', 'telefon', 'stevilkaPacienta',
                    'ulica', 'hisnaStevilka', 'posta', 'kraj',  'datumRojstva', 'spol',
                    'kontaktnaOseba', 'sifra_okolisa', 'kontaktIme', 'kontaktPriimek',
                  'kontaktTelefon', 'kontaktSorodstvo')

    def create(self, validated_data):
        print('data: ', validated_data)
        uporabnik_data = validated_data.pop('uporabnik', None)
        uporabnik = UporabnikSerializer.create(UporabnikSerializer, uporabnik_data)
        uporabnik.save()
        print('uporabnik: ', uporabnik)
        print(validated_data['posta'])
        posta = Posta.objects.get(kraj = validated_data.pop('posta')['kraj'])
        print('posta: ', posta)
        if ('vezaniPacienti' in validated_data.keys()):
            validated_data['vezaniPacienti'] = PacientPostSerializer.create(PacientPostSerializer, validated_data.pop('vezaniPacienti'))
        if ('kontaktna_oseba' in validated_data.keys()):
            validated_data['kontaktna_oseba'] = KontaktnaOsebaSerializer.create(KontaktnaOsebaSerializer, validated_data.pop('kontaktna_oseba'))
        validated_data['uporabnik'] = uporabnik
        validated_data['posta'] = posta
        print('data: ', validated_data)
        pacient = super(PacientPostSerializer, self).create(validated_data)
        return pacient


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

class SifrakolisaSerializer(serializers.ModelSerializer):

    class Meta:
        model = SifraOkolisa
        fields = ('id', 'naziv')
