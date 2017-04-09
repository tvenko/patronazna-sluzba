from rest_framework import permissions

class IsAdminOrReadAuthenticated(permissions.BasePermission):
    """
        Razred za dovoljenja, ki dovoli adminu da kreira, vsem ostalim avtenticiranim pa da samo berejo
    """

    def has_permission(self, request, view):
        # Preveri ali ima uporabnik v request dovoljenje za ogled (vseh?)

        # Dovoljeno le adminu da vidi vse delavce
        return True; # Zacasna resitev za Swagger
        if request.user.je_admin:
            return True

    def has_object_permission(self, request, view, delavec):
        # Dovoljenje za branje je dovoljeno vsem prijavljenim delavcem
        # zato jim dovolimo GET, HEAD in OPTION poizvedbe

        # Dovoljenje za pisanje je dovoljeno samo administratorju
        if request.user.je_admin:
            return True

        if request.method in permissions.SAFE_METHODS:
            # Delavec lahko bere samega sebe (drugi ne morejo videti podrobnosti)
            return request.user == delavec.uporabnik
