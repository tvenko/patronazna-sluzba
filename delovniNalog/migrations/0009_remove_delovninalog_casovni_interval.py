# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-04-04 14:35
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('delovniNalog', '0008_auto_20170403_1816'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='delovninalog',
            name='casovni_interval',
        ),
    ]