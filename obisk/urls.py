from django.conf.urls import url, include
from rest_framework import routers

from obisk import views

router = routers.DefaultRouter()
router.register(r'obiski', views.ObiskViewSet, base_name='obisk')
router.register(r'planirani', views.ObiskiPlaniraniViewSet)
router.register(r'prihajajoci', views.ObiskiPrihajajociViewSet)
router.register(r'meritve', views.MeritevViewSet, base_name='meritev')
router.register(r'meritvenaobisku', views.MeritveNaObiskuViewSet, base_name='meritevnaobisku')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]