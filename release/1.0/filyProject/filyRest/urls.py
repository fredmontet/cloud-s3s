from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from filyRest import views

urlpatterns = [
    # Bucket listing 
    url(r'^api/buckets/$', views.BucketList.as_view()),
    url(r'^api/buckets/(?P<pk>[0-9]+)/$', views.BucketDetail.as_view()),
    # S3 Management
    #url(r'^api/manager/create-bucket', views.manager, name='manager'),
    #url(r'^api/manager/delete-bucket', views.manager, name='manager'),
]

urlpatterns = format_suffix_patterns(urlpatterns)