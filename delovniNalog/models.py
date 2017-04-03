from django.db import models
from obisk.models import Obisk
from accounts.models import Delavec, Pacient, Uporabnik

class VrstaObiska(models.Model):
    """Razred, ki predstavlja sifrant vrst obiskov

    Model VrstaObiska vsebuje sifro in opis vrste obiska.
    """

    opis = models.CharField(max_length=255)

    def __str__(self):
        return self.opis

class Bolezen(models.Model):
    """Razred, ki predstavlja sifrant bolezni

    Model Bolezen vsebuje sifro in opis bolezni.
    """

    sifra = models.CharField(primary_key=True, max_length=10)
    opis = models.CharField(max_length=255)

    def __str__(self):
        return self.opis

class Material(models.Model):
    """Razred, ki vsebuje sifrant materiala

    Model Material vsebuje id in opis materiala.
    """

    opis = models.CharField(max_length=255)

    def __str__(self):
        return self.opis

class Zdravilo(models.Model):
    """Razred, ki vsebuje sifrant zdravil

    Model Zdravilo vsebuje sifro, naziv in opis zdravila.
    """

    sifra = models.IntegerField(primary_key=True)
    naziv = models.CharField(max_length=50)
    opis = models.CharField(max_length=255)

    def __str__(self):
        return self.naziv

class DelovniNalog(models.Model):
    """Razred, ki vsebuje vse informacije o delovnem nalogu

    Model DelovniNalog, vsebuje tuje kljuce sifro zdravnika, id pacienta, id obiska, sifro zdravila,
    id materiala, sifro bolezni in sifro vrste obiska.
    """

    sifra_zdravnika = models.ForeignKey(Delavec, on_delete=models.SET_NULL, null=True) #kak naredit da bos lahk sam zdravnika zbral?
    id_pacienta = models.ManyToManyField(Pacient)
    id_obiska = models.ForeignKey(Obisk, on_delete=models.SET_NULL, null=True)
    sifra_zdravila = models.ManyToManyField(Zdravilo, blank=True)
    id_materiala = models.ManyToManyField(Material, blank=True) #kak dolocis stevilo materiala?
    sifra_bolezni = models.ForeignKey(Bolezen, on_delete=models.SET_NULL, null=True, blank=True)
    vrsta_obiska = models.ForeignKey(VrstaObiska, on_delete=models.SET_NULL, null=True)
    datum_prvega_obiska = models.DateField()
    je_obvezen_datum = models.BooleanField()
    stevilo_obiskov = models.IntegerField()
    casovni_interval = models.TimeField(blank=True, null=True)
    casovno_obdobje = models.DateField(blank=True, null=True)
    patronazna_sestra = models.ForeignKey(Uporabnik, on_delete=models.SET_NULL, null=True) #kak naredis da bos lahko zbral sam partonzano sestro

    def __str__(self):
        return str(self.id)