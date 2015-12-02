from filyRest.models import Bucket
from filyRest.serializers import BucketSerializer
from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from StringIO import StringIO
from django.core.management import call_command
import boto


class BucketList(generics.ListCreateAPIView):
    queryset = Bucket.objects.all()
    serializer_class = BucketSerializer


class BucketDetail(APIView):
    """
    Retrieve, update or delete a bucket instance.
    """
    def get_object(self, pk):
        try:
            return Bucket.objects.get(pk=pk)
        except Bucket.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        bucket = self.get_object(pk)
        serializer = BucketSerializer(bucket)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
    	#s3 = boto.connect_s3()
        bucket = self.get_object(pk)
        serializer = BucketSerializer(bucket, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
    	#s3 = boto.connect_s3()
        bucket = self.get_object(pk)
        #Attention - un bucket doit etre vide pour etre supprime
        #s3.delete_bucket(bucket.uuid)
        bucket.delete()	
        return Response(status=status.HTTP_204_NO_CONTENT)


