from django.db import models

class SifraUstanove(models.Model):
    """class representing institutions

    This is a SifraUstanove Model containing name of institutions
    """

    naziv = models.CharField(max_length=255)

    #izpis na django admin panelu
    def __str__(self):
        return self.naziv

class VrstaDelavca(models.Model):
    """class representing type of workers

    This is a VrstaDelavca Model containing type of workers
    """

    naziv = models.CharField(max_length=20)

    #izpis na django admin panelu
    def __str__(self):
        return self.naziv

class Delavec(models.Model):
    """class representing all workers

    This is a Delavec Model containing information about workers email (also username),
    first and second name, phone number, personal id, id of institution, and type of worker
    (zdravnik, vodja PS, patronazna sestra,usluzbenec)
    """

    osebna_sifra = models.IntegerField(primary_key=True)        # kako velika je lahko osebna sifra?
    email = models.EmailField(max_length=255)
    geslo = models.CharField(max_length=128)                    #to nisem cist ziher ce je kul tak
    priimek = models.CharField(max_length=30)
    ime = models.CharField(max_length=30)
    tel = models.CharField(max_length=9)                        #so lahko tudi +386?
    sifra_ustanove = models.ForeignKey(SifraUstanove, on_delete=models.SET_NULL, null=True)
    vrsta_delavca = models.ForeignKey(VrstaDelavca, on_delete=models.SET_NULL, null=True)

    #izpis na django admin panelu
    def __str__(self):
        return self.ime+" "+self.priimek