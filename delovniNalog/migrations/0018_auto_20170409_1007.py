# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-09 08:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('delovniNalog', '0017_auto_20170404_1901'),
    ]

    operations = [
        migrations.AlterField(
            model_name='delovninalog',
            name='id_pacienta',
            field=models.ManyToManyField(blank=True, to='accounts.Pacient'),
        ),
    ]