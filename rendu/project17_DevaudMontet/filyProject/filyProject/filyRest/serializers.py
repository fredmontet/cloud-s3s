from rest_framework import serializers
from filyRest.models import Bucket
from django.core.management import call_command

class BucketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bucket
        fields = ('id', 'uuid', 'bucket_name', 'created', 'expires_in_seconds', 'url_up', 'url_down', 'status')