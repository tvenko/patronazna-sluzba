# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-04-03 16:16
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('delovniNalog', '0007_auto_20170403_1743'),
    ]

    operations = [
        migrations.RenameField(
            model_name='delovninalog',
            old_name='vrste_obiska',
            new_name='vrsta_obiska',
        ),
    ]