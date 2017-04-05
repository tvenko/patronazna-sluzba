# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-04-04 15:00
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('delovniNalog', '0010_delovninalog_casovni_interval'),
    ]

    operations = [
        migrations.CreateModel(
            name='DelovniNalogMaterial',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kolicina', models.IntegerField()),
            ],
        ),
        migrations.RemoveField(
            model_name='delovninalog',
            name='id_materiala',
        ),
        migrations.AddField(
            model_name='vrstaobiska',
            name='material',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='delovninalogmaterial',
            name='id_delovni_nalog',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='delovniNalog.DelovniNalog'),
        ),
        migrations.AddField(
            model_name='delovninalogmaterial',
            name='id_material',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='delovniNalog.Material'),
        ),
    ]