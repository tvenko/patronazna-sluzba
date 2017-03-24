from django.contrib.auth.models import AbstractBaseUser
from django.db import models

class Posta(models.Model):

    stevilka = models.IntegerField(primary_key=True)
    kraj = models.CharField(max_length=255)

class SifraUstanove(models.Model):
    """Razred, ki predstavlja zdravstvene ustanove

    Model SifraUstanove, ki vsebuje ime zdravstvene ustanove.
    """

    id = models.IntegerField(primary_key=True)
    naziv = models.CharField(max_length=255)
    ulica = models.CharField(max_length=255)
    hisna_stevilka = models.CharField(max_length=5)
    posta = models.ForeignKey(Posta, on_delete=models.SET_NULL, null=True)


    #izpis na django admin panelu
    def __str__(self):
        return self.naziv

class VrstaDelavca(models.Model):
    """Razred, ki predstavlja vrste delavcev

    Model VrstaDelavca, ki vsebuje nazive tipov delavcev.
    """

    naziv = models.CharField(max_length=20)

    #izpis na django admin panelu
    def __str__(self):
        return self.naziv

class SifraOkolisa(models.Model):

    naziv = models.CharField(max_length=255)


class SorodstvenoRazmerje(models.Model):
    naziv = models.CharField(max_length=30)

class KontaktnaOseba(models.Model):


    priimek = models.CharField(max_length=30)
    ime = models.CharField(max_length=30)
    tel = models.CharField(max_length=13)
    sorodstveno_razmerje = models.ForeignKey(SorodstvenoRazmerje, on_delete=models.SET_NULL, null=True)


class Uporabnik(AbstractBaseUser):

    email = models.EmailField(max_length=255, unique=True)
    priimek = models.CharField(max_length=30)
    ime = models.CharField(max_length=30)
    tel = models.CharField(max_length=13)


class Delavec(models.Model):
    """Razred, ki predstavlja zdravtvene delavce

    Model Delavec vsebuje informacije o emailu (hkratu uporabnisko ime), imeni in priimku,
    telefonski stevilki, osebni stevilki, sifri zdravstvene ustanove in tipu delavca
    (zdravnik, vodja PS, patronazna sestra,usluzbenec).
    """

    uporabnik = models.OneToOneField(Uporabnik, on_delete=models.CASCADE)

    osebna_sifra = models.IntegerField(primary_key=True)
    sifra_ustanove = models.ForeignKey(SifraUstanove, on_delete=models.SET_NULL, null=True)
    vrsta_delavca = models.ForeignKey(VrstaDelavca, on_delete=models.SET_NULL, null=True)

    #izpis na django admin panelu
    def __str__(self):
        return self.ime+" "+self.priimek

class Pacient(models.Model):


    uporabnik = models.OneToOneField(Uporabnik, on_delete=models.CASCADE)

    st_kartice = models.IntegerField(primary_key=True)
    ulica = models.CharField(max_length=255)
    posta = models.ForeignKey(Posta, on_delete=models.SET_NULL, null=True)
    sifra_okolisa = models.ForeignKey(SifraOkolisa, on_delete=models.SET_NULL, null=True)
    datum_rojstva = models.DateField()
    spol = models.BooleanField()
    kontaktna_oseba = models.ForeignKey(KontaktnaOseba, on_delete=models.SET_NULL, null=True)
