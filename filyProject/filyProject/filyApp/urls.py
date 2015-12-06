from django.conf.urls import url

from . import views

urlpatterns = [
	# /
    url(r'^$', views.login, name='login'),
    # /admin
    url(r'^admin', views.admin, name='admin'),
    # /bucket
    url(r'^bucket', views.bucket, name='bucket'),
]