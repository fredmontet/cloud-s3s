from django.shortcuts import render

def login(request):
    return render(request, 'filyApp/login.html')

def admin(request):
    return render(request, 'filyApp/admin.html')

def bucket(request):
    return render(request, 'filyApp/bucket.html')