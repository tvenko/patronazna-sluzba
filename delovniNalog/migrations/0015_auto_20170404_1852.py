# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-04-04 16:52
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('delovniNalog', '0014_remove_delovninalog_id_materiala'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='delovninalogmaterial',
            name='id_delovni_nalog',
        ),
        migrations.RemoveField(
            model_name='delovninalogmaterial',
            name='id_material',
        ),
        migrations.DeleteModel(
            name='DelovniNalogMaterial',
        ),
    ]