# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-04-03 15:43
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('delovniNalog', '0006_auto_20170403_1741'),
    ]

    operations = [
        migrations.AlterField(
            model_name='delovninalog',
            name='id_materiala',
            field=models.ManyToManyField(blank=True, to='delovniNalog.Material'),
        ),
        migrations.AlterField(
            model_name='delovninalog',
            name='sifra_bolezni',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='delovniNalog.Bolezen'),
        ),
        migrations.AlterField(
            model_name='delovninalog',
            name='sifra_zdravila',
            field=models.ManyToManyField(blank=True, to='delovniNalog.Zdravilo'),
        ),
    ]