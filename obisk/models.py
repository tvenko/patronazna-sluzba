from django.db import models
from accounts.models import Uporabnik
from delovniNalog.models import DelovniNalog

class Obisk(models.Model):
    """Razred, ki bo vseboval podatke o obiskih

    zaenkrat vsebuje id, tuj kljuc patronazne sestre, datum obiska in polje ali je datum obvezen
    """

    predvideni_datum = models.DateField()
    dejanski_datum = models.DateField(null=True, blank=True)
    je_opravljen = models.BooleanField(default=False)
    je_obvezen_datum = models.BooleanField(default=False)
    delovni_nalog = models.ForeignKey(DelovniNalog, on_delete=models.SET_NULL, null=True)
    patronazna_sestra = models.ForeignKey(Uporabnik, on_delete=models.SET_NULL, null=True, related_name='%(class)s_patronazna_sestra')
    nadomestna_patronazna_sestra = models.ForeignKey(Uporabnik, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_nadomestna_patronazna_sestra')


    def __str__(self):
        return str(self.id)
