from accounts.serializers import *
from accounts.views import DelavciViewSet, PacientiViewSet
import json

def jwt_response_payload_handler(token, user=None, request=None):
    """
        Definira vrnjene podatke pri avtentikaciji z tokenom.
    """

    uporabnik = UporabnikSerializer(user, context={'request': request}).data
    # Dovoli spreminjanje zahteve (nevarno!)
    request.query_params._mutable = True
    request.method = 'GET'
    request.query_params['uporabnik'] = str(uporabnik['id'])
    request.query_params._mutable = False

    # Preveri ali je uporabnik pacient ali delavec
    delavec = json.loads(DelavciViewSet.as_view({'get': 'list'})(request).render().content.decode('utf-8'))['results']
    pacient = json.loads(PacientiViewSet.as_view({'get': 'list'})(request).render().content.decode('utf-8'))['results']

    # Vrne samo tistega, katero vlogo podpira, ce ni nobene vrni samo uporabnika
    if not delavec and pacient:
        return {
            'token': token,
            'pacient': pacient
        }
    elif not pacient and delavec:
        return {
            'token': token,
            'delavec': delavec
        }
    else:
        return {
            'token': token,
            'user': uporabnik
        }
