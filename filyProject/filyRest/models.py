from django.db import models
import uuid

class Bucket(models.Model):
	uuid = models.UUIDField(default=uuid.uuid4, editable=False)
	created = models.DateTimeField(auto_now_add=True)
	expires_in_seconds = models.IntegerField()
	url_up = models.URLField(max_length=600, blank=True, default='')
	url_down = models.URLField(max_length=600, blank=True, default='')
	status = models.CharField(max_length=100)

	class Meta:
		ordering = ('created',)