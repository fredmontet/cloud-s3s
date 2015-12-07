from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from filyRest import views

urlpatterns = [
    # Bucket listing 
    url(r'^api/buckets/$', views.BucketList.as_view()),
    url(r'^api/buckets/(?P<pk>[0-9]+)/$', views.BucketDetail.as_view()),
 ]

urlpatterns = format_suffix_patterns(urlpatterns)