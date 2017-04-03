from django.conf.urls import url, include
from rest_framework import routers

from delovniNalog import views

router = routers.DefaultRouter()
router.register(r'vrsteobiskov', views.VrstaObiskaViewSet, base_name='vrstaobiska')
router.register(r'bolezni', views.BolezenViewSet, base_name='bolezen')
router.register(r'material', views.MaterialViewSet, base_name='material')
router.register(r'zdravila', views.ZdravilaViewSet, base_name='zdravilo')
router.register(r'delovninalogi', views.DelovniNalogViewSet, base_name='delovni_nalog')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]