# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-03-28 15:26
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_auto_20170328_1713'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pacient',
            name='hisna_stevilka',
        ),
    ]