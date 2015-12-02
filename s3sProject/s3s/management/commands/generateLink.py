from django.core.management.base import BaseCommand, CommandError

# Import used in S3
import boto
import uuid
from boto.s3.key import Key

class Command(BaseCommand):
	help = 'Generate a link'

	def handle(self, *args, **options):
		
		s3 = boto.connect_s3()
		bucket_name = "python-sdk-sample-%s" % uuid.uuid4()
		print "Creating new bucket with name: " + bucket_name
		bucket = s3.create_bucket(bucket_name)

		expires_in_seconds = 1800

		k = Key(bucket)
		k.key = 'file_sample'
		k.set_contents_from_filename("file-test.txt")
		link_url = k.generate_url(expires_in_seconds)
				
    		return link_url

        