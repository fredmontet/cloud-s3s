from django.db import models
import uuid

class Bucket(models.Model):
	uuid = models.UUIDField(default='')
	bucket_name = models.CharField(max_length=100, default='')
	created = models.DateTimeField(auto_now_add=True)
	expires_in_seconds = models.IntegerField()
	url_up = models.URLField(max_length=600, blank=True, default='')
	url_down = models.URLField(max_length=600, blank=True, default='')
	STATUS_CHOICES = (('empty','empty'),('full','full'),('expired', 'expired'))
	status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='empty')

	class Meta:
		ordering = ('created',)