from django.core.management.base import BaseCommand, CommandError
from boto.s3.key import Key
# Import used in S3
import boto
import uuid

class Command(BaseCommand):
    help = 'Get the presigned url for upload'

    def handle(self, *args, **options):
        conn = boto.connect_s3()
        
        bucket_name = "boto_bucket_fred"
        bucket = conn.get_bucket(bucket_name)
        
        k = Key(bucket)
        k.key = 'test-key' #Should be replaced dynamically with e.g. the uuid 
        k.set_contents_from_string('Hello World, I am Fred from Fribourg!')

        expires_in_seconds = 1800
        url = k.generate_url(expires_in_seconds)
        
        return url