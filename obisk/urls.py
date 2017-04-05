from django.conf.urls import url, include
from rest_framework import routers

from obisk import views

router = routers.DefaultRouter()
router.register(r'obiski', views.ObiskViewSet, base_name='obisk')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]