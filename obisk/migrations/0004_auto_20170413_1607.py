# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-13 14:07
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('obisk', '0003_auto_20170413_1600'),
    ]

    operations = [
        migrations.AlterField(
            model_name='obisk',
            name='patronazna_sestra',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]
