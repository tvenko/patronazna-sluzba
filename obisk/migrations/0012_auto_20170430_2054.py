# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-30 18:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('obisk', '0011_auto_20170428_1509'),
    ]

    operations = [
        migrations.AlterField(
            model_name='obisk',
            name='dejanski_datum',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='obisk',
            name='predvideni_datum',
            field=models.DateTimeField(),
        ),
    ]
