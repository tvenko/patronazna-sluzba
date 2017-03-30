from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from accounts import views

#router = routers.DefaultRouter()
#router.register(r'delavci/$', views.uporabnik_seznam)

urlpatterns = [
    #url(r'^', include(router.urls)),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
    url(r'^uporabniki/$', views.UporabnikSeznam.as_view(), name='uporabniki-seznam'),
    url(r'^uporabniki/(?P<pk>[0-9]+)/$', views.UporabnikPodrobno.as_view(), name='uporabnik-podrobno'),
    url(r'^delavci/$', views.DelavciSeznam.as_view(), name='delaveci-seznam'),
    url(r'^delavci/(?P<pk>[0-9]+)/$', views.DelavecPodrobno.as_view(), name='delavec-podrobno'),
    url(r'^ustanove/$', views.UstanoveSeznam.as_view(), name='ustanove-seznam'),
    url(r'^ustanove/(?P<pk>[0-9]+)/$', views.UstanovaPodrobno.as_view(), name='ustanova-podrobno'),
    url(r'^vrstedelavcev/$', views.VrstaDelavcaSeznam.as_view(), name='vrstedelavecev-seznam'),
    url(r'^vrstedelavcev/(?P<pk>[0-9]+)/$', views.DelavecPodrobno.as_view(), name='vrstadelavca-podrobno'),
]

# Login and logout views for the browsable API
urlpatterns += [
    url(r'^api-auth/', include('rest_framework.urls',
    namespace='rest_framework')),
]