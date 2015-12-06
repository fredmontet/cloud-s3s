# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filyRest', '0006_auto_20151204_1530'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bucket',
            name='uuid',
            field=models.UUIDField(default=b''),
        ),
    ]
