from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = 'Generate a link'

    def handle(self, *args, **options):
    	return "http://www.9gag.com"

        