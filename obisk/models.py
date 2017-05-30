from django.db import models
from accounts.models import Uporabnik, VezaniPacient
from delovniNalog.models import DelovniNalog, VrstaObiska

class Meritev(models.Model):
    """Razred, ki vsebuje podatke o vseh moznih meritvah

    Model Meritev vsebuje id, naziv (opis oz. ime meritve), podatek v kateri merski enoti je meritev,
    spodnjo in zgornjo mejo (velja samo pri numericnih meritvah) in pa podatek pri katri vrsti obiska jo je potrebno izpolniti
    """

    id = models.IntegerField(primary_key=True)
    naziv = models.CharField(max_length=255)
    merska_enota = models.CharField(max_length=20, null=True, blank=True)
    sp_meja = models.IntegerField(blank=True, null=True)
    zg_meja = models.IntegerField(blank=True, null=True)
    vrsta_obsika = models.ForeignKey(VrstaObiska, on_delete=models.SET_NULL, null=True)
    je_obvezen = models.BooleanField(default=False)
    enkraten = models.BooleanField(default=False)
    meritev_novorojencka = models.BooleanField(default=False)
    tip = models.CharField(max_length=20, default='text')

    def __str__(self):
        return str(self.id) + ' ' + self.naziv

class Obisk(models.Model):
    """Razred, ki vsebuje podatke o obiskih

    Model Obisk vsebuje id, , predviden datum obiska, datum dejanskega obiska,  polje ali je datum obvezen,
    in tuje kljuce za delovni nalog in patronazno sestro, ter lahko vsebuje tudi tuj kljuc za nadomestno patronazno sestro.
    """

    predvideni_datum = models.DateTimeField()
    dejanski_datum = models.DateTimeField(null=True, blank=True)
    je_opravljen = models.BooleanField(default=False)
    je_obvezen_datum = models.BooleanField(default=False)
    delovni_nalog = models.ForeignKey(DelovniNalog, on_delete=models.SET_NULL, null=True, related_name='obisk')
    patronazna_sestra = models.ForeignKey(Uporabnik, on_delete=models.SET_NULL, null=True, related_name='%(class)s_patronazna_sestra')
    nadomestna_patronazna_sestra = models.ForeignKey(Uporabnik, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_nadomestna_patronazna_sestra')
    id_meritev = models.ManyToManyField(Meritev, blank=True, through='MeritveNaObisku')
    je_prvi = models.BooleanField(default=False);

    def __str__(self):
        return str(self.id)

class MeritveNaObisku(models.Model):
    """Razred, ki predstavlja vmesno tabelo za meritve opravljene na enem obisku.

    Model MeritveNaObisku, vsebuje id obiska in meritve, ter vrednost (oz. prosti vnos), ki jo je meritev zavzela.
    """

    id_obisk = models.ForeignKey(Obisk, on_delete=models.SET_NULL, null=True)
    id_meritve = models.ForeignKey(Meritev, on_delete=models.SET_NULL, null=True)
    vrednost = models.CharField(max_length=1000)

    def __str__(self):
        return self.id_meritve.naziv + " za obisk " + str(self.id_obisk.id)
