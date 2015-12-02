from django.db import models
import uuid

class Bucket(models.Model):
	uuid = models.UUIDField(default=uuid.uuid4, editable=False)
	# user = models.ForeignKey(User) # TODO: add user if time...
	created = models.DateTimeField(auto_now_add=True)
	expires_in_seconds = models.IntegerField()
	url = models.URLField(max_length=600, blank=True, default='')
	status = models.CharField(max_length=100)

	class Meta:
		ordering = ('created',)