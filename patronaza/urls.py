"""patronaza URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin

from rest_framework.schemas import get_schema_view
from rest_framework_swagger.renderers import SwaggerUIRenderer, OpenAPIRenderer
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token



from accounts.views import index

# TODO, napisat svoj get_schema z posebnimi dovoljenji?
schema_view = get_schema_view(title='Account API', renderer_classes=[OpenAPIRenderer, SwaggerUIRenderer])

# Vkljucen JWT, (http://getblimp.github.io/django-rest-framework-jwt/), je
# dovolj ce je samo tu?
urlpatterns = [
    url(r'^$', index, name='index'),
    url(r'^docs/', schema_view, name='docs'),
    url(r'^api/v1/racuni/', include('accounts.urls')),
    url(r'^api/v1/dn/', include('delovniNalog.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^api-token-auth/', obtain_jwt_token),
    url(r'^api-token-refresh/', refresh_jwt_token),
    url(r'^api-token-verify/', verify_jwt_token),
]
