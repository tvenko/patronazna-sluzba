# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-15 08:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('obisk', '0012_auto_20170430_2054'),
    ]

    operations = [
        migrations.AddField(
            model_name='obisk',
            name='konec_nadomescanja',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='obisk',
            name='zacetek_nadomescanja',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]