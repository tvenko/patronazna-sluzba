# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-19 10:41
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0018_kadrovskadelavec'),
    ]

    operations = [
        migrations.CreateModel(
            name='VezaniPacient',
            fields=[
                ('st_kartice', models.IntegerField(primary_key=True, serialize=False)),
                ('ime', models.CharField(max_length=30)),
                ('priimek', models.CharField(max_length=30)),
                ('datum_rojstva', models.DateField()),
                ('spol', models.BooleanField()),
            ],
        ),
        migrations.RemoveField(
            model_name='pacient',
            name='vezani_pacienti',
        ),
    ]
