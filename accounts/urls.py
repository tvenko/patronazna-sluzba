from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from accounts import views

#router = routers.DefaultRouter()
#router.register(r'delavci/$', views.uporabnik_seznam)

urlpatterns = [
    #url(r'^', include(router.urls)),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
    url(r'^uporabniki/$', views.UporabnikSeznam.as_view()),
    url(r'^uporabniki/(?P<pk>[0-9]+)/$', views.UporabnikPodrobno.as_view()),
    url(r'^delavci/$', views.DelavciSeznam.as_view()),
    url(r'^delavci/(?P<pk>[0-9]+)/$', views.DelavecPodrobno.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns) # da si lahko zbiras v kakem formatu ti vrne serializer zapis