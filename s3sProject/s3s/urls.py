from django.conf.urls import url

from . import views

urlpatterns = [
	# /s3s
    url(r'^$', views.index, name='index'),

    # /s3s/admin
    url(r'^admin/', views.admin, name='admin'),

    # /s3s/bucket
    url(r'^bucket/', views.bucket, name='bucket'),
]