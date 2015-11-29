from django.shortcuts import render
from django.http import HttpResponse
from .models import BucketLink

# Create your views here.

def index(request):
    index = "Index stuff"
    context = {'index': index}
    return render(request, 's3s/index.html', context)

def admin(request):
	admin = "Admin stuff"
	context = {'admin': admin}
	return render(request, 's3s/admin.html', context)

def bucket(request):
    bucket = "Bucket stuff"
    context = {'bucket': bucket}
    return render(request, 's3s/bucket.html', context)