from django.shortcuts import render
from django.http import HttpResponse
from .models import BucketLink
from django.core.management import call_command
from django.core import management
from StringIO import StringIO

# Create your views here.

def index(request):
    index = "Index stuff"
    form_dest = "./admin"
    context = {	'index': index, 
    			'form_dest': form_dest
    			}
    return render(request, 's3s/index.html', context)

def admin(request):
	admin = "Admin stuff"
	index_link = "../"
	context = {	'admin': admin,
				'index_link': index_link}
	return render(request, 's3s/admin.html', context)

def bucket(request):
    bucket = "Bucket stuff"
    context = {'bucket': bucket}
    return render(request, 's3s/bucket.html', context)

def manager(request):
    action = request.GET.get("action")
    out = StringIO()
    call_command('s3Mgr',action, stdout=out)
    result = out.getvalue()
    return HttpResponse(result)