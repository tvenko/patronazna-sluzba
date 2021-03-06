# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-04-04 14:37
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_auto_20170404_1636'),
        ('obisk', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='obisk',
            name='opis',
        ),
        migrations.AddField(
            model_name='obisk',
            name='datum',
            field=models.DateField(default='1999-11-11'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='obisk',
            name='je_obvezen_datum',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='obisk',
            name='patronazna_sestra',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.Delavec'),
        ),
    ]
