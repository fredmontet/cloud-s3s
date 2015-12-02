from django.shortcuts import render

def admin(request):
    return render(request, 'filyApp/admin.html')

def bucket(request):
    return render(request, 'filyApp/bucket.html')