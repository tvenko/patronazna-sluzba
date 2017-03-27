from django.db import models

#se ni dokoncan -> stvar naslednjga sprinta zej se ne rabimo
class Obisk(models.Model):
    """Razred, ki bo vseboval podatke o obiskih

    """

    opis = models.CharField(max_length=255)

    def __str__(self):
        return self.opis
