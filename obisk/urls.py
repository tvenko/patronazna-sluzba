from django.conf.urls import url, include
from rest_framework import routers

from obisk import views

router = routers.DefaultRouter()
router.register(r'obiski', views.ObiskViewSet, base_name='obisk')
router.register(r'planirani', views.ObiskiPlaniraniViewSet, base_name='obisk-planirani')
router.register(r'prihajajoci', views.ObiskiPrihajajociViewSet, base_name='obisk-prihajajoci')
router.register(r'meritve', views.MeritevViewSet, base_name='meritev')
router.register(r'meritvenaobisku', views.MeritveNaObiskuViewSet, base_name='meritevnaobisku')
router.register(r'prvi', views.ObiskPrviViewSet, base_name='prvi')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]