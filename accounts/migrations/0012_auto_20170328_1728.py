# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-03-28 15:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_pacient_hisna_stevilka'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pacient',
            name='vezani_pacienti',
            field=models.ManyToManyField(blank=True, related_name='_pacient_vezani_pacienti_+', to='accounts.Pacient'),
        ),
    ]
