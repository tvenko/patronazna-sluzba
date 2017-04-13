from django.conf.urls import url, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_jwt.views import obtain_jwt_token

from accounts import views

router = routers.DefaultRouter()
router.register(r'uporabniki', views.UporabnikViewSet, base_name='uporabnik')
router.register(r'delavci', views.DelavciViewSet, base_name='delavec')
router.register(r'pacienti', views.PacientiViewSet, base_name='pacient')
router.register(r'vrstedelavcev', views.VrstaDelavcaViewSet, base_name='vrstadelavca')
router.register(r'ustanove', views.UstanoveViewSet, base_name='ustanova')
router.register(r'kontaktneosebe', views.KontaktnaOsebaViewSet, base_name='kontaktna_oseba')
router.register(r'sifreokolisa', views.SifraOkolisaViewSet, base_name='sifra_okolisa')

# Vkljucen JWT, je dovolj samo na root url?
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    #url(r'^api-token-auth/', obtain_jwt_token),
]
