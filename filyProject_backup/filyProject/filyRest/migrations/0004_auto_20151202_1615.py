# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filyRest', '0003_auto_20151202_0922'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bucket',
            old_name='url',
            new_name='url_down',
        ),
        migrations.AddField(
            model_name='bucket',
            name='url_up',
            field=models.URLField(default=b'', max_length=600, blank=True),
        ),
    ]
