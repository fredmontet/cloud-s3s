from django.conf.urls import url

from . import views

urlpatterns = [
	# /
    url(r'^$', views.admin, name='admin'),
    # /bucket
    url(r'^bucket', views.bucket, name='bucket'),
]