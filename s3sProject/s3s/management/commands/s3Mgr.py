from django.core.management.base import BaseCommand, CommandError
from boto.s3.key import Key
# Import used in S3
import boto
import uuid

class Command(BaseCommand):
    help = 'Generate a link'

    def add_arguments(self, parser):

        parser.add_argument('action',
            default=False,
            help='Delete poll instead of closing it')

    def handle(self, *args, **options):
        if options['action'] == "get-url":
            s3 = boto.connect_s3()
            
            bucket_name = "python-sdk-sample-%s" % uuid.uuid4()
            bucket = s3.create_bucket(bucket_name)
            
            k = Key(bucket)
            k.key = 'python_sample_key.txt'
            k.set_contents_from_string('Hello World!')

            expires_in_seconds = 1800
            linkUrl = k.generate_url(expires_in_seconds)
            
            return linkUrl
        elif options['action'] == "upload":

            return "upload"
        else:
            return "no valid args"



        