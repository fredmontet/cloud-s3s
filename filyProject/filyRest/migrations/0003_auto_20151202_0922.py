# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filyRest', '0002_auto_20151201_2117'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bucket',
            name='url',
            field=models.URLField(default=b'', max_length=600, blank=True),
        ),
    ]
