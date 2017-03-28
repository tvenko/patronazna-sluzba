from django.db import models

#se ni dokoncan -> stvar 8 uporabniske zgodbe
class Obisk(models.Model):
    """Razred, ki bo vseboval podatke o obiskih

    """

    opis = models.CharField(max_length=255)

    def __str__(self):
        return self.opis
