# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filyRest', '0005_bucket_bucket_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bucket',
            name='bucket_name',
            field=models.CharField(default=b'', max_length=100),
        ),
        migrations.AlterField(
            model_name='bucket',
            name='status',
            field=models.CharField(default=b'', max_length=100),
        ),
    ]
