from django.db import models

class VrstaObiska(models.Model):

    sifra = models.IntegerField(primary_key=True)
    opis = models.CharField(max_length=255)

    def __str__(self):
        return self.opis