from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class Posta(models.Model):
    """Razred, ki predstavlja sifrant post

    Model Posta, ki vsebuje postno stevilko in ime kraja
    """

    stevilka = models.IntegerField(primary_key=True)
    kraj = models.CharField(max_length=255)

    def __str__(self):      #izpis na django admin panelu
        return str(self.stevilka)+" "+self.kraj

class SifraUstanove(models.Model):
    """Razred, ki predstavlja zdravstvene ustanove

    Model SifraUstanove, ki vsebuje ime zdravstvene ustanove.
    """

    id = models.IntegerField(primary_key=True)
    naziv = models.CharField(max_length=255)
    ulica = models.CharField(max_length=255)
    hisna_stevilka = models.CharField(max_length=5)
    posta = models.ForeignKey(Posta, on_delete=models.SET_NULL, null=True)

    def __str__(self):      #izpis na django admin panelu
        return self.naziv

class VrstaDelavca(models.Model):
    """Razred, ki predstavlja vrste delavcev

    Model VrstaDelavca, ki vsebuje nazive tipov delavcev.
    """

    naziv = models.CharField(max_length=20)

    def __str__(self):      #izpis na django admin panelu
        return self.naziv

class SifraOkolisa(models.Model):
    """Razred, ki predstavlja sifrant okolisev

    Model SifraOkolisa, ki vsebuje naziv okolisa
    """

    naziv = models.CharField(max_length=255)

    def __str__(self):      #izpis na django admin panelu
        return self.naziv


class SorodstvenoRazmerje(models.Model):
    """Razred, ki predstavlja sifrant sorodstvenih razmerij

    Model SorodstvenoRazmerje, ki vsebuje naziv sorodstvenega razmerja
    """

    naziv = models.CharField(max_length=40)

    def __str__(self):      #izpis na django admin panelu
        return self.naziv

class KontaktnaOseba(models.Model):
    """Razred, ki vsebuje podatke o kontaktni osebi pacienta

    Model KontaktnaOseba, ki vsebuje ime, priimek, telefonsko stevilko in sifro sorodsvenega razmerja
    """

    priimek = models.CharField(max_length=30)
    ime = models.CharField(max_length=30)
    tel = models.CharField(max_length=13)
    sorodstveno_razmerje = models.ForeignKey(SorodstvenoRazmerje, on_delete=models.SET_NULL, null=True)

    def __str__(self):      #izpis na django admin panelu
        return self.ime+" "+self.priimek


class UporabnikManager(BaseUserManager):
    """Razred UporabnikManager je potreben zaradi tega, ker imamo lasten model za Uporabnika.
    S tem razredom pokrijemo funkcionalnosti, ki jih ima privzeti Django uporabniski model."""

    #ukaz za kreiranjenovega uporabnika
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Uporabnik mora imeti veljaven e-mail naslov')

        account = self.model(
            email=self.normalize_email(email)
        )

        account.set_password(password)
        account.save()

        return account

    #ukaz za kreiranje novega administratorja
    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)

        account.je_admin = True
        account.save()

        return account

class Uporabnik(AbstractBaseUser):
    """Razred, ki predstavlja uporabnike.

    Model Uporabnik je krovni razred za model Delavec in Pacient.
    Vsebuje email (hkrati tudi uporabnisko ime), priimek, ime, telefonsko stevilko,
    in podatek o tem ali je admin.
    """
    email = models.EmailField(max_length=255, unique=True)
    priimek = models.CharField(max_length=30)
    ime = models.CharField(max_length=30)
    tel = models.CharField(max_length=13)
    je_admin = models.BooleanField(default=False)

    objects = UporabnikManager()

    #potrebno zaradi django auth
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):      #izpis na django admin panelu
        return self.ime+" "+self.priimek

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return ' '.join([self.ime, self.priimek])

    def get_short_name(self):
        return self.ime

    @property
    def is_superuser(self):
        return self.je_admin

    @property
    def is_staff(self):
        return self.je_admin

    def has_perm(self, perm, obj=None):
        return self.je_admin

    def has_module_perms(self, app_label):
        return self.je_admin

class Delavec(models.Model):
    """Razred, ki predstavlja zdravtvene delavce

    Model Delavec deduje od modela Uporabnik in dodaja osebni stevilki,
    sifri zdravstvene ustanove in tipu delavca(zdravnik, vodja PS, patronazna sestra,usluzbenec).
    """

    uporabnik = models.OneToOneField(Uporabnik, on_delete=models.CASCADE)

    osebna_sifra = models.IntegerField(primary_key=True)
    sifra_ustanove = models.ForeignKey(SifraUstanove, on_delete=models.SET_NULL, null=True)
    vrsta_delavca = models.ForeignKey(VrstaDelavca, on_delete=models.SET_NULL, null=True)

    def __str__(self):      #izpis na django admin panelu
        return self.uporabnik.ime+" "+self.uporabnik.priimek

class Pacient(models.Model):
    """Razred, ki predstavlja paciente

    Model Pacient deduje od razreda Uporabnik in dodaja stevilko zdravstvene kartice, ulico, posto,
    sifro okolisa, datum rojstva, spol in kontaktno osebo.
    """

    uporabnik = models.OneToOneField(Uporabnik, on_delete=models.CASCADE)

    st_kartice = models.IntegerField(primary_key=True)
    ulica = models.CharField(max_length=255)
    hisna_stevilka = models.CharField(max_length=6)
    posta = models.ForeignKey(Posta, on_delete=models.SET_NULL, null=True)
    sifra_okolisa = models.ForeignKey(SifraOkolisa, on_delete=models.SET_NULL, null=True)
    datum_rojstva = models.DateField()
    spol = models.BooleanField()
    kontaktna_oseba = models.ForeignKey(KontaktnaOseba, on_delete=models.SET_NULL, null=True, blank=True)
    je_aktiviran = models.BooleanField(default=False)
    vezani_pacienti = models.ManyToManyField('self', blank=True)

    def __str__(self):      #izpis na django admin panelu
        return self.uporabnik.ime+" "+self.uporabnik.priimek