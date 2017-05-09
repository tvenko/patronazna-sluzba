# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-02 13:34
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0023_vezanipacient_pacient_skrbnik'),
        ('delovniNalog', '0021_auto_20170428_1509'),
    ]

    operations = [
        migrations.AddField(
            model_name='delovninalog',
            name='vezani_pacienti',
            field=models.ManyToManyField(blank=True, to='accounts.VezaniPacient'),
        ),
        migrations.AlterField(
            model_name='delovninalog',
            name='datum_izdaje',
            field=models.DateTimeField(default=datetime.datetime(2017, 5, 2, 13, 34, 5, 505824, tzinfo=utc)),
        ),
        migrations.RemoveField(
            model_name='delovninalog',
            name='id_pacienta',
        ),
        migrations.AddField(
            model_name='delovninalog',
            name='id_pacienta',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.Pacient'),
        ),
    ]