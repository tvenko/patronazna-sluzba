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
router.register(r'kadrovskadelavci', views.KadrovskaDelavecViewSet, base_name='kadrovksa_delavec')
router.register(r'vezanipacienti', views.VezaniPacientiViewSet, base_name='vezani_pacient')
router.register(r'potrditevregistracije', views.PotrditevRegistracijeViewSet, base_name='potrditev_registracije')
router.register(r'poste', views.PostaViewSet, base_name='poste')
router.register(r'sorodniki', views.SorodstvenoRazmerjeViewSet, base_name='sorodstvena_razmerja')
router.register(r'sestra', views.NadomestnaSestraViewSet, base_name='nadomestna_sestra')
<<<<<<< HEAD
router.register(r'sestre', views.PatronazneSestreViewSet, base_name='patronazne_sestre')
=======
router.register(r'pozabljenogeslo', views.PozabljenoGesloViewSet, base_name='pozabljeno_geslo')
router.register(r'potrditevgesla', views.PotrditevGeslaViewSet, base_name='potrditev_gesla')
>>>>>>> becc886147e064741645d7361f311d523304d6c5

# Vkljucen JWT, je dovolj samo na root url?
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    #url(r'^api-token-auth/', obtain_jwt_token),
]
