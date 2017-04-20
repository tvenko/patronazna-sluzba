# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-03-28 15:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_auto_20170328_1703'),
        ('delovniNalog', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='delovninalog',
            name='id_materiala',
        ),
        migrations.AddField(
            model_name='delovninalog',
            name='id_materiala',
            field=models.ManyToManyField(to='delovniNalog.Material'),
        ),
        migrations.RemoveField(
            model_name='delovninalog',
            name='id_pacienta',
        ),
        migrations.AddField(
            model_name='delovninalog',
            name='id_pacienta',
            field=models.ManyToManyField(to='accounts.Pacient'),
        ),
        migrations.RemoveField(
            model_name='delovninalog',
            name='sifra_zdravila',
        ),
        migrations.AddField(
            model_name='delovninalog',
            name='sifra_zdravila',
            field=models.ManyToManyField(to='delovniNalog.Zdravilo'),
        ),
    ]