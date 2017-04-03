from django.conf.urls import url, include
from rest_framework import routers

from accounts import views

router = routers.DefaultRouter()
router.register(r'uporabniki', views.UporabnikViewSet, base_name='uporabnik')
router.register(r'delavci', views.DelavciViewSet, base_name='delavec')
router.register(r'vrstedelavcev', views.VrstaDelavcaViewSet, base_name='vrstadelavca')
router.register(r'ustanove', views.UstanoveViewSet, base_name='ustanova')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]