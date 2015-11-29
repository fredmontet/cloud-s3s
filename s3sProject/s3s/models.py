from django.db import models
from django.contrib.auth.models import User
import uuid

"""
When changing smth here: 

python manage.py makemigrations
python manage.py migrate

"""


# Create your models here.

class BucketLink(models.Model):
	uuid = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4)
	awsLink = models.CharField(max_length=200)
	user = models.ForeignKey(User)
	expiration = models.DateTimeField(blank=True) # Todo: changer la date....