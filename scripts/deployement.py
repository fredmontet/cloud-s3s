import boto

ec2 = boto.connect_ec2()

reservation = ec2.run_instances(
	image_id = "ami-bb709dd2",
	key_name = "devaud-key-pair-frankfurt",
    user_data = """#!/bin/bash
apt-get update
echo "Welcome home"
git status
""")

# Wait a minute or two while it boots
for r in ec2.get_all_instances():
    if r.id == reservation.id:
        break

print r.instances[0].public_dns_name