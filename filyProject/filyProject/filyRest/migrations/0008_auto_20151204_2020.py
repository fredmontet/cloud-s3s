# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filyRest', '0007_auto_20151204_1552'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bucket',
            name='status',
            field=models.CharField(default=b'empty', max_length=100, choices=[(b'empty', b'empty'), (b'full', b'full'), (b'expired', b'expired')]),
        ),
    ]
