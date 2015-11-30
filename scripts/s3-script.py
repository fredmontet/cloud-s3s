# Copyright 2013. Amazon Web Services, Inc. All Rights Reserved.
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Import the SDK

import boto
import uuid

# Instantiate a new client for Amazon Simple Storage Service (S3). With no
# parameters or configuration, the AWS SDK for Python (Boto) will look for
# access keys in these environment variables:
#    AWS_ACCESS_KEY_ID='...'
#    AWS_SECRET_ACCESS_KEY='...'
#
# Environment variables are in home/current_user/.aws/credentials
# 
# For more information about this interface to Amazon S3, see:
# http://boto.readthedocs.org/en/latest/s3_tut.html
s3 = boto.connect_s3()
# Everything uploaded to Amazon S3 must belong to a bucket. These buckets are
# in the global namespace, and must have a unique name.
#
# For more information about bucket name restrictions, see:
# http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html
bucket_name = "python-sdk-sample-%s" % uuid.uuid4()
print "Creating new bucket with name: " + bucket_name
bucket = s3.create_bucket(bucket_name)

expires_in_seconds = 1800

from boto.s3.key import Key
k = Key(bucket)

print "####################################################################################"
k.key = 'python_sample_key.txt'

print "Uploading some data to " + bucket_name + " with key: " + k.key
k.set_contents_from_string('Hello World!')


print "Generating a public URL for the object we just uploaded. This URL will be active for %d seconds" % expires_in_seconds
print
print k.generate_url(expires_in_seconds)
print 

k.key = 'file_sample'
k.set_contents_from_filename("file-test.txt")

print "Generating a public URL for the object we just uploaded. This URL will be active for %d seconds" % expires_in_seconds
print
print k.generate_url(expires_in_seconds)

print "####################################################################################"
print "Generating a public URL to upload file on it. This URL will be active for %d seconds" % expires_in_seconds
print

#fp = open('file-test.txt')
#content_length = len(fp.read())
#url = s3.generate_url(300, 'PUT', 'file-test', 'foobar', headers={'Content-Length': str(content_length)}, force_http=True)
url = bucket.generate_url(expires_in_seconds, 'PUT', force_http=True)

print url
print 

print "####################################################################################"
raw_input("Press enter to delete both the object and the bucket...")

# Buckets cannot be deleted unless they're empty. Since we still have a
# reference to the key (object), we can just delete it.
print "Deleting the objects."

bucketListResultSet = bucket.list()
result = bucket.delete_keys([key.name for key in bucketListResultSet])

# Now that the bucket is empty, we can delete it.
print "Deleting the bucket."
s3.delete_bucket(bucket_name)
