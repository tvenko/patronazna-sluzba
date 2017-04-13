from django.db import models
from accounts.models import Uporabnik

#se ni dokoncan -> stvar 2. sprinta
class Obisk(models.Model):
    """Razred, ki bo vseboval podatke o obiskih

    zaenkrat vsebuje id, tuj kljuc patronazne sestre, datum obiska in polje ali je datum obvezen
    """

    patronazna_sestra = models.ForeignKey(Uporabnik, on_delete=models.SET_NULL, null=True)
    datum = models.DateTimeField()
    je_obvezen_datum = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id)
