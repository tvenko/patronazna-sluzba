# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-05-08 12:36
from __future__ import unicode_literals

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('delovniNalog', '0023_auto_20170508_1434'),
    ]

    operations = [
        migrations.AlterField(
            model_name='delovninalog',
            name='datum_izdaje',
            field=models.DateTimeField(default=datetime.datetime(2017, 5, 8, 12, 35, 59, 760798, tzinfo=utc)),
        ),
    ]
