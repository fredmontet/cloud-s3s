from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = 'Upload a file in a bucket'

    def handle(self, *args, **options):
    	print "Upload de donnees dans le bucket"
        