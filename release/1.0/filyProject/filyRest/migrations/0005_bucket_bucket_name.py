# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filyRest', '0004_auto_20151202_1615'),
    ]

    operations = [
        migrations.AddField(
            model_name='bucket',
            name='bucket_name',
            field=models.CharField(default='none', max_length=100),
            preserve_default=False,
        ),
    ]
