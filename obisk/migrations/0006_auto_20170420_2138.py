# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-20 19:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('obisk', '0005_auto_20170420_2108'),
    ]

    operations = [
        migrations.AlterField(
            model_name='obisk',
            name='dejanski_datum',
            field=models.DateField(blank=True),
        ),
    ]