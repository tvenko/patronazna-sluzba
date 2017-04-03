from django.db import models
from obisk.models import Obisk
from accounts.models import Delavec, Pacient

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
    sifra_zdravila = models.ManyToManyField(Zdravilo)
    id_materiala = models.ManyToManyField(Material)
    sifra_bolezni = models.ForeignKey(Bolezen, on_delete=models.SET_NULL, null=True)
    vrste_obiska = models.ForeignKey(VrstaObiska, on_delete=models.SET_NULL, null=True)
    #datum prvega obiska
    #je obvezen datum
    #stevilo obiskov
    #casovni interval
    #casovno obdobje
    #sestra