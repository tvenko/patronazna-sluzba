# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-15 09:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0027_auto_20170509_2150'),
    ]

    operations = [
        migrations.AddField(
            model_name='delavec',
            name='konec_odsotnosti',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='delavec',
            name='zacetek_odsotnosti',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
