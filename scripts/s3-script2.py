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
from boto.s3.cors import CORSConfiguration

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


'''
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>DELETE</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
'''

# CORS setup
cors_cfg = CORSConfiguration()
cors_cfg.add_rule(['GET', 'PUT', 'POST', 'DELETE'], '*', allowed_header='*')

bucket_name = 'python-cors'
print "Creating new bucket with name: " + bucket_name

bucket = s3.create_bucket(bucket_name)

#bucket = c.lookup('python-cors')
bucket.set_cors(cors_cfg)

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
