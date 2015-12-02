from rest_framework import serializers
from filyRest.models import Bucket

class BucketSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bucket
        fields = ('id', 'uuid', 'created', 'expires_in_seconds', 'url', 'status')

"""
class BucketSerializer(serializers.Serializer):
    pk = serializers.CharField(read_only=True, max_length=100)
    created = serializers.CharField()
    expires_in_seconds = serializers.IntegerField()
    url = serializers.CharField(max_length=300)
    status = serializers.CharField()

    def create(self, validated_data):
        
        Create and return a new `Snippet` instance, given the validated data.
        
        return Bucket.objects.create(**validated_data)

    def update(self, instance, validated_data):
        
        Update and return an existing `Snippet` instance, given the validated data.
        
        instance.title = validated_data.get('title', instance.title)
        instance.code = validated_data.get('code', instance.code)
        instance.linenos = validated_data.get('linenos', instance.linenos)
        instance.language = validated_data.get('language', instance.language)
        instance.style = validated_data.get('style', instance.style)
        instance.save()
        return instance
"""