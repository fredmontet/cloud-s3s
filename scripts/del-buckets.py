import boto
import uuid

s3 = boto.connect_s3()

print "Deleting the objects."

buckets = s3.get_all_buckets()  # returns a list of bucket objects
print buckets

bucketListResultSet = buckets[0].list()
result = buckets[0].delete_keys([key.name for key in bucketListResultSet])

# Now that the bucket is empty, we can delete it.
print "Deleting the bucket."
s3.delete_bucket(buckets[0])