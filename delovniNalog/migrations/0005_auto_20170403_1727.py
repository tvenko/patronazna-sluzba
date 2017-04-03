# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-04-03 15:27
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('delovniNalog', '0004_auto_20170329_0001'),
    ]

    operations = [
        migrations.AddField(
            model_name='delovninalog',
            name='casovni_interval',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='delovninalog',
            name='casovno_obdobje',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='delovninalog',
            name='datum_prvega_obiska',
            field=models.DateField(default='1999-11-11'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='delovninalog',
            name='je_obvezen_datum',
            field=models.BooleanField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='delovninalog',
            name='patronazna_sestra',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='delovninalog',
            name='stevilo_obiskov',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
