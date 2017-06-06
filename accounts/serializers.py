from django.contrib.auth import update_session_auth_hash
from django.http import HttpResponse
from rest_framework import serializers
from accounts.models import *
from django.core.mail import send_mail
from django.core.mail import EmailMessage

class KontaktnaOsebaSerializer(serializers.ModelSerializer):

    sorodstveno_razmerje = serializers.CharField(source='sorodstveno_razmerje.naziv')
    kraj = serializers.CharField(source='posta.kraj')

    class Meta:

        model = KontaktnaOseba
        fields = ('ime', 'priimek', 'tel', 'sorodstveno_razmerje', 'ulica',
        'hisna_stevilka', 'posta', 'kraj')

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
        fields = ('id', 'ime', 'priimek', 'email', 'tel', 'last_login', 'je_admin')
        write_only_fields = ('password', 'id')

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

class PosodobiGesloUporabnikaSerializer(serializers.ModelSerializer):

    novoGeslo = serializers.CharField(source='password')
    # ime je zato ker on rabi eno polje ki je ze v bazi in ne more bit dvakrat isto, je cesko nareto ampak dela :)
    staroGeslo = serializers.CharField(source='ime')

    class Meta:
        model = Uporabnik
        fields = ('novoGeslo', 'staroGeslo')

    def update(self, uporabnik, validated_data):
        print(validated_data)
        if (uporabnik.check_password(validated_data['ime'])):
            uporabnik.set_password(validated_data['password'])
            uporabnik.save()
            return uporabnik

class PosodobiDatumUporabnikaSerializer(serializers.ModelSerializer):

	class Meta:
		model = Uporabnik
		fields = ('last_login',)

	def update(self, uporabnik, validated_data):
		uporabnik.last_login = validated_data.get('last_login', uporabnik.last_login)
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

class VezaniPacientSerializer(serializers.ModelSerializer):

    class Meta:
        model = VezaniPacient
        fields = ('st_kartice', 'ime', 'priimek', 'spol', 'datum_rojstva', 'pacient_skrbnik', 'sorodstveno_razmerje')

    def create(self, validated_data):
        vezaniPacient = VezaniPacient(**validated_data)
        vezaniPacient.save()
        return vezaniPacient

class PacientGetSerializer(serializers.ModelSerializer):
    """
        Razred, ki vraca podatke za pacienta.
    """

    vezaniPacienti = serializers.PrimaryKeyRelatedField(many=True, read_only=True, source='vezani_pacienti')
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
                  'kontaktnaOseba', 'vezaniPacienti', 'spol', 'je_aktiviran')

class PacientPostSerializer(serializers.ModelSerializer):
    """
        Razred, za kreiranje pacienta
    """

    uporabnik = serializers.PrimaryKeyRelatedField(read_only=True)
    vezani_pacienti = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    otrokIme = serializers.CharField(source='vezani_pacienti.ime', required=False)
    otrokPriimek = serializers.CharField(source='vezani_pacienti.priimek', required=False)
    otrokStKartice = serializers.IntegerField(source='vezani_pacienti.st_kartice', required=False)
    otrokSpol = serializers.BooleanField(source='vezani_pacienti.spol', required=False)
    otrokDatumRojstva = serializers.DateField(source='vezani_pacienti.datum_rojstva', required=False)
    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    eposta = serializers.EmailField(source='uporabnik.email')
    password = serializers.CharField(source='uporabnik.password')
    telefon = serializers.CharField(source='uporabnik.tel')
    stevilkaPacienta = serializers.IntegerField(source='st_kartice')
    datumRojstva = serializers.DateField(source='datum_rojstva')
    posta = serializers.PrimaryKeyRelatedField(read_only=True)
    kraj = serializers.CharField(source='posta.kraj')
    kontaktnaOseba = KontaktnaOsebaSerializer(source='kontaktna_oseba', required=False)
    hisnaStevilka = serializers.CharField(source='hisna_stevilka')


    class Meta:
        model = Pacient
        fields = ('uporabnik', 'ime', 'priimek', 'eposta', 'password', 'telefon', 'stevilkaPacienta',
                    'ulica', 'hisnaStevilka', 'posta', 'kraj',  'datumRojstva', 'spol',
                    'kontaktnaOseba', 'sifra_okolisa', 'otrokIme', 'otrokPriimek', 'otrokSpol',
                  'otrokStKartice', 'otrokDatumRojstva', 'vezani_pacienti',)

    def create(self, validated_data):
        jeVezanPacient = False
        uporabnik_data = validated_data.pop('uporabnik', None)
        uporabnik = UporabnikSerializer.create(UporabnikSerializer, uporabnik_data)
        uporabnik.save()
        posta = Posta.objects.get(kraj = validated_data.pop('posta')['kraj'])
        if ('vezani_pacienti' in validated_data.keys()):
            data = validated_data.pop('vezani_pacienti')
            if ('ime' in data.keys()):
                jeVezanPacient = True
        if ('kontaktna_oseba' in validated_data.keys()):
            validated_data['kontaktna_oseba'] = KontaktnaOsebaSerializer.create(KontaktnaOsebaSerializer, validated_data.pop('kontaktna_oseba'))
        validated_data['uporabnik'] = uporabnik
        validated_data['posta'] = posta
        pacient = super(PacientPostSerializer, self).create(validated_data)
        if (jeVezanPacient):
            data['pacient_skrbnik'] = pacient
            VezaniPacientSerializer.create(VezaniPacientSerializer, data)
        prejemnik = uporabnik.email
        zadeva = 'Potrditev registracije'
        posiljatelj = 'patronazamail@gmail.com'
        htmlVsebina = '<h3>Pozdravljeni!</h3><br><p>S klikom na povezavo potrdite registracijo vašega računa na strani Patronažna služba: <a href="http://fruity-routy.ddns.net/potrditev-registracije;id=' + str(pacient.st_kartice) + '">povezava</a></p>'
        sporocilo = EmailMessage(zadeva, htmlVsebina, posiljatelj, [prejemnik])
        sporocilo.content_subtype = "html"
        sporocilo.send()
        return pacient

class PacientUpdateSerializer(serializers.ModelSerializer):

    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    eposta = serializers.EmailField(source='uporabnik.email')
    telefon = serializers.CharField(source='uporabnik.tel')
    datumRojstva = serializers.DateField(source='datum_rojstva')
    kraj = serializers.CharField(source='posta.kraj')
    hisnaStevilka = serializers.CharField(source='hisna_stevilka')

    class Meta:
        model = Pacient
        fields = ('ime', 'priimek', 'eposta', 'telefon', 'ulica', 'hisnaStevilka', 'kraj', 'sifra_okolisa',  'datumRojstva')

    def update(self, pacient, validated_data):
        print(pacient.uporabnik)
        if ('ime' in validated_data['uporabnik'].keys()):
            pacient.uporabnik.ime = validated_data['uporabnik']['ime']
        if ('priimek' in validated_data['uporabnik'].keys()):
            pacient.uporabnik.priimek = validated_data['uporabnik']['priimek']
        if ('email' in validated_data['uporabnik'].keys()):
            pacient.uporabnik.email = validated_data['uporabnik']['email']
        if ('tel' in validated_data['uporabnik'].keys()):
            pacient.uporabnik.tel = validated_data['uporabnik']['tel']
        if ('ulica' in validated_data.keys()):
            pacient.ulica = validated_data['ulica']
        if ('datum_rojstva' in validated_data.keys()):
            pacient.datum_rojstva = validated_data['datum_rojstva']
        if ('kraj' in validated_data['posta'].keys()):
            pacient.posta = Posta.objects.get(kraj = validated_data.pop('posta')['kraj'])
            # ne dela
        if ('hisna_stevilka' in validated_data.keys()):
            pacient.hisna_stevilka = validated_data['hisna_stevilka']
        pacient.save()
        return pacient


class PacientObiskSerializer(serializers.ModelSerializer):

    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    telefon = serializers.CharField(source='uporabnik.tel')
    stevilkaPacienta = serializers.IntegerField(source='st_kartice')
    kraj = serializers.CharField(source='posta.kraj')
    #kontaktnaOseba = serializers.PrimaryKeyRelatedField(read_only=True, source='kontaktna_oseba')
    hisnaStevilka = serializers.CharField(source='hisna_stevilka')

    class Meta:
        model = Pacient
        fields = ('ime', 'priimek', 'telefon', 'stevilkaPacienta', 'kraj', 'hisnaStevilka', 'ulica')

class SestraObiskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Uporabnik
        fields = ('ime', 'priimek', 'tel', 'email')

class DelavecObiskSerializer(serializers.ModelSerializer):

    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    naziv_delavca = serializers.CharField(source='vrsta_delavca.naziv')

    class Meta:
        model = Delavec
        fields = ('ime', 'priimek', 'osebna_sifra', 'naziv_delavca')


class VrstaDelavcaSerializer(serializers.ModelSerializer):
    """
        Razred, ki serializira objekt VrstaDelavca v JSON
    """
    class Meta:
        model = VrstaDelavca
        fields = ('id', 'naziv')

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

class KadrovkaDelavcSerializer(serializers.ModelSerializer):

    class Meta:
        model = KadrovskaDelavec
        fields = ('id', 'ime', 'priimek')

class PotrditevRegistracijeSerializer(serializers.ModelSerializer):

	class Meta:
		model = Pacient
		fields = ('je_aktiviran','st_kartice')

	def update(self, pacient, validated_data):
		pacient.je_aktiviran = validated_data.get('je_aktiviran', pacient.je_aktiviran)
		pacient.save()
		return pacient

class PostaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Posta
        fields = ('stevilka', 'kraj')


class SorodstvenoRazmerjeSerializer(serializers.ModelSerializer):

    class Meta:
        model = SorodstvenoRazmerje
        fields =('id', 'naziv')

class PacientDetailsSerializer(serializers.ModelSerializer):

    kontaktna_oseba = KontaktnaOsebaSerializer()
    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    email = serializers.EmailField(source='uporabnik.email')
    tel = serializers.CharField(source='uporabnik.tel')
    okolis = serializers.CharField(source='sifra_okolisa.naziv')
    kraj = serializers.CharField(source='posta.kraj')

    class Meta:
        model = Pacient
        exclude = ('je_aktiviran', 'sifra_okolisa', 'uporabnik')

class ZdravnikSerializer(serializers.ModelSerializer):

    ime = serializers.CharField(source='uporabnik.ime')
    sifra_uporabnika = serializers.CharField(source='uporabnik.id')
    priimek = serializers.CharField(source='uporabnik.priimek')
    email = serializers.EmailField(source='uporabnik.email')
    tel = serializers.CharField(source='uporabnik.tel')
    naziv_ustanove = serializers.CharField(source='sifra_ustanove.naziv')
    naziv_delavca = serializers.CharField(source='vrsta_delavca.naziv')
    naziv_okolisa = serializers.CharField(source='sifra_okolisa.naziv')

    class Meta:
        model = Delavec
        fields = ('ime', 'priimek', 'email', 'tel', 'naziv_okolisa', 'naziv_ustanove',
        'naziv_delavca', 'osebna_sifra', 'sifra_uporabnika')

class PatronaznaSestraSerializer(serializers.ModelSerializer):
    delavec = serializers.StringRelatedField()
    zacetek_odsotnosti = serializers.CharField(source='delavec.zacetek_odsotnosti')
    konec_odsotnosti = serializers.CharField(source='delavec.konec_odsotnosti')
    osebna_sifra = serializers.CharField(source='delavec.osebna_sifra')
    naziv_delavca = serializers.CharField(source='delavec.vrsta_delavca')

    class Meta:
        model = Uporabnik
        exclude = ('delavec', 'password', 'je_admin')

class PozabljenoGesloSerializer(serializers.ModelSerializer):

	#mail in geslo sta poslana kot ime in priimek, da ne teži za že obstoječi email
	class Meta:
		model = Uporabnik
		fields = ('id', 'ime', 'priimek')
		write_only_fields = ('password', 'id')

	def create(self, validated_data):
		mail = validated_data.get('ime')
		geslo = validated_data.get('priimek')
		uporabnik = Uporabnik.objects.get(email = mail)
		prejemnik = uporabnik.email
		zadeva = 'Pozabljeno geslo'
		posiljatelj = 'patronazamail@gmail.com'
		htmlVsebina = '<h3>Pozdravljeni!</h3><br><p>S klikom na povezavo potrdite novo geslo: <a href="http://fruity-routy.ddns.net/potrditev-gesla;id=' + str(uporabnik.id) + ';geslo=' + str(geslo) + '">povezava</a></p>'
		sporocilo = EmailMessage(zadeva, htmlVsebina, posiljatelj, [prejemnik])
		sporocilo.content_subtype = "html"
		sporocilo.send()
		return uporabnik

class PotrditevGeslaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Uporabnik
        fields = ('id', 'password')
        write_only_fields = ('password', 'id')

    def update(self, uporabnik, validated_data):
        uporabnik.set_password(validated_data['password'])
        uporabnik.save()
        return uporabnik

class PatronaznaSestraDelavecSerializer(serializers.ModelSerializer):
    ime = serializers.CharField(source='uporabnik.ime')
    priimek = serializers.CharField(source='uporabnik.priimek')
    uporabnik = serializers.IntegerField(source='uporabnik.id')


    class Meta:
        model = Delavec
        fields = ('ime', 'priimek', 'osebna_sifra', 'uporabnik',
        'zacetek_odsotnosti', 'konec_odsotnosti')
		
class PosodobiOsebjeSerializer(serializers.ModelSerializer):

	ime = serializers.CharField(source='uporabnik.ime')
	priimek = serializers.CharField(source='uporabnik.priimek')
	email = serializers.EmailField(source='uporabnik.email')
	tel = serializers.CharField(source='uporabnik.tel')
	password = serializers.CharField(source='uporabnik.password', required=False)
	naziv_ustanove = serializers.CharField(source='sifra_ustanove.naziv')
	naziv_delavca = serializers.CharField(source='vrsta_delavca.naziv')
	naziv_okolisa = serializers.CharField(source='sifra_okolisa.naziv')

	class Meta:
		model = Delavec
		fields = ('ime', 'priimek', 'tel', 'email', 'password', 'osebna_sifra', 'naziv_ustanove', 'naziv_delavca', 'naziv_okolisa')
		
	def update(self, delavec, validated_data):
		uporabnik = Uporabnik.objects.get(id = delavec.uporabnik_id)
		uporabnik.ime = validated_data.get('uporabnik')['ime']
		uporabnik.priimek = validated_data.get('uporabnik')['priimek']
		uporabnik.email = validated_data.get('uporabnik')['email']
		uporabnik.tel = validated_data.get('uporabnik')['tel']
		if 'password' in validated_data.get('uporabnik'):
			uporabnik.set_password(validated_data.get('uporabnik')['password'])
		print(validated_data)
		delavec.sifra_ustanove = SifraUstanove.objects.get(naziv =  validated_data.pop('sifra_ustanove', None)['naziv'])
		delavec.vrsta_delavca = VrstaDelavca.objects.get(naziv = validated_data.pop('vrsta_delavca', None)['naziv'])
		delavec.sifra_okolisa = SifraOkolisa.objects.get(naziv = validated_data.pop('sifra_okolisa', None)['naziv'])
		delavec.save()
		uporabnik.save()
		return delavec