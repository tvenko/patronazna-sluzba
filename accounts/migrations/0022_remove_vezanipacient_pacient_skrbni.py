# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-19 17:22
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0021_auto_20170419_1253'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vezanipacient',
            name='pacient_skrbni',
        ),
    ]
