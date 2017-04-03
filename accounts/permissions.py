from rest_framework import permissions

class IsAdminOrReadAuthenticated(permissions.BasePermission):
    """
        Razred za dovoljenja, ki dovoli adminu da kreira, vsem ostalim avtenticiranim pa d asamo berejo
    """

    def has_object_permission(self, request, delavec):
        # Dovoljenje za branje je dovoljeno vsem prijavljenim delavcem
        # zato jim dovolimo GET, HEAD in OPTION poizvedbe
        if request.method in permissions.SAFE_METHODS:
            return request.user == delavec.uporabnik

        # Dovoljenje za pisanje je dovoljeno samo administratorju
        return request.user.je_admin