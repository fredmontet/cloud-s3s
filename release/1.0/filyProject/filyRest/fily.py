#!/usr/bin/python

from boto.s3.key import Key
import boto
import uuid

        
class Fily:

	# Static var
	conn = boto.connect_s3()
	bucket_name = "boto_bucket_fred"

	def __init__(self):
		# Class var
		self.bucket = conn.get_bucket(bucket_name)

	def getUploadLink(self):
		k = Key(bucket)
		k.key = 'test-key' #Should be replaced dynamically with e.g. the uuid 
		k.set_contents_from_string('Hello World, I am Fred from Fribourg!')
		expires_in_seconds = 1800
		url = k.generate_url(expires_in_seconds)
		return url
	
	def upload(self):
		print "upload"

	def download(self):
		print "download"