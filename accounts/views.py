from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, permissions, generics
from accounts.permissions import IsAdminOrReadAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import date
from dateutil.parser import parse
from django.shortcuts import get_object_or_404
from django.db.models import Q
from obisk.models import *
from obisk.serializers import *
import json

from accounts.serializers import *


def index(request):
    return HttpResponse("Deluje! Nahajate se na API od aplikacije Patronazna sestra.")

class UporabnikViewSet(viewsets.ModelViewSet):
    #permission_classes = (permissions.IsAdminUser,)
    #permission_classes = (IsAuthenticated,)
    queryset = Uporabnik.objects.all()
    def get_serializer_class(self):
	    if self.request.method == 'PUT':
		    return PosodobiGesloUporabnikaSerializer
	    if self.request.method == 'PATCH':
		    return PosodobiDatumUporabnikaSerializer
	    return UporabnikSerializer

class DelavciViewSet(viewsets.ModelViewSet):
    #permission_classes = (IsAdminOrReadAuthenticated,)
    serializer_class = DelavecSerializer

    def get_queryset(self):
        """
        Vrne delavca, ce je v URL napisan id uporabnika
        """
        queryset = Delavec.objects.all()
        uporabnik = self.request.query_params.get('uporabnik', None)
        if uporabnik is not None:
            queryset = Delavec.objects.filter(uporabnik_id=uporabnik)
        # dobi vrsto delavca ?vd=
        vrstaDelavca = self.request.query_params.get('vd', None)
        if vrstaDelavca is not None:
            queryset = Delavec.objects.filter(vrsta_delavca=vrstaDelavca)
        zdravniki = self.request.query_params.get('q1', None)
        if zdravniki is not None:
            queryset = Delavec.objects.filter((Q(vrsta_delavca=1) | Q(vrsta_delavca=2)) &
                (Q(uporabnik__ime__icontains=zdravniki) |
                Q(uporabnik__priimek__icontains=zdravniki))
            )
        sestre = self.request.query_params.get('q2', None)
        if sestre is not None:
            queryset = Delavec.objects.filter(Q(vrsta_delavca=3) &
                (Q(uporabnik__ime__icontains=sestre) |
                Q(uporabnik__priimek__icontains=sestre))
            )
        return queryset

class VezaniPacientiViewSet(viewsets.ModelViewSet):
    serializer_class = VezaniPacientSerializer

    def get_queryset(self):
        """
        Vrne vse vezane paciente za dolocenega uporabnika
        """
        queryset = VezaniPacient.objects.all()
        skrbnik = self.request.query_params.get('skrbnik', None)
        if skrbnik is not None:
            queryset = VezaniPacient.objects.filter(pacient_skrbnik=skrbnik);
        return queryset

class PacientiViewSet(viewsets.ModelViewSet):

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PacientPostSerializer
        if self.request.method == 'PATCH':
            return PacientUpdateSerializer
        return PacientGetSerializer

    def get_queryset(self):
        """
        Vrne pacienta, ce je v URL napisan id uporabnika
        """
        queryset = Pacient.objects.all()
        pacient = self.request.query_params.get('uporabnik', None)
        query = self.request.query_params.get('q', None)
        if pacient is not None:
            queryset = Pacient.objects.filter(uporabnik_id=pacient)
        # Query po poljih: ime, priimek, st_kartice, neznam drugace kot da
        # napisem kombinacije po katerih lahko pride?
        if query is not None:
            if len(query.split()) > 1:
                query = query.split()
                queryset = Pacient.objects.filter(
                    Q(uporabnik__ime__icontains=query) |
                    Q(uporabnik__priimek__icontains=query) |
                    Q(uporabnik__ime__icontains=query[0]) & Q(uporabnik__priimek__icontains=query[1]) |
                    Q(uporabnik__priimek__icontains=query[0]) & Q(uporabnik__ime__icontains=query[1]) |
                    Q(st_kartice__icontains=query)
                )
            else:
                queryset = Pacient.objects.filter(
                    Q(uporabnik__ime__icontains=query) |
                    Q(uporabnik__priimek__icontains=query) |
                    Q(st_kartice__icontains=query)
                )
        return queryset


class VrstaDelavcaViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = VrstaDelavca.objects.all()
    serializer_class = VrstaDelavcaSerializer

class UstanoveViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = SifraUstanove.objects.all()
    serializer_class = UstanoveSerializer

class KontaktnaOsebaViewSet(viewsets.ModelViewSet):
    queryset = KontaktnaOseba.objects.all()
    serializer_class =  KontaktnaOsebaSerializer

class SifraOkolisaViewSet(viewsets.ModelViewSet):
    queryset = SifraOkolisa.objects.all()
    serializer_class = SifrakolisaSerializer

class KadrovskaDelavecViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KadrovskaDelavec.objects.all()
    serializer_class = KadrovkaDelavcSerializer

class PotrditevRegistracijeViewSet(viewsets.ModelViewSet):
    queryset = Pacient.objects.all()
    serializer_class = PotrditevRegistracijeSerializer

class PostaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Posta.objects.all()
    serializer_class = PostaSerializer
    pagination_class = None

class SorodstvenoRazmerjeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SorodstvenoRazmerje.objects.all()
    serializer_class = SorodstvenoRazmerjeSerializer
    pagination_class = None

class NadomestnaSestraViewSet(viewsets.GenericViewSet):
    serializer_class = ObiskSerializer

    @detail_route(methods=['patch'])
    def nadomesti(self, request, *args, **kwargs):
        '''Nadomesti sestro v URL s tisto poslano v body'''
        # Preveri da so vsi podatki za dodeljevanje nadomescanja podani
        pk = kwargs.pop('pk', None)
        context = {"request": request,}
        danes = timezone.now();
        pretekli_datum = False;
        pretekli_polja = {};
        podatki_manjkajo = False
        manjkajoci = {}
        naroben_format_datuma = False
        format_problemi = {}
        zacetek_nadomescanja = ''
        konec_nadomescanja = ''
        nadomestna_sestra = ''
        nadomestna_sestra_delavec = ''
        if 'nadomestna_patronazna_sestra' not in request.data.keys():
            podatki_manjkajo = True
            manjkajoci['nadomestna_patronazna_sestra'] = 'Podatek o nadomestni sestri manjka'
        else:
            # Poskusi dobiti uporabnika
            try:
                nadomestna_sestra = Uporabnik.objects.get(pk=request.data['nadomestna_patronazna_sestra'])
            except Uporabnik.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND, data=dict(message='Ne najdem uporabnika, ki bi moral nadomeščati'))
            try:
                nadomestna_sestra_delavec = PatronaznaSestraSerializer(nadomestna_sestra, context=context)
                if nadomestna_sestra_delavec.data['naziv_delavca'] != "patronažna sestra":
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=dict(message='Podan delavec ni patronažna sestra in zato ne more nadomeščati'))
            except Delavec.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND, data=dict(message='Ne najdem delavca, ki bi moral nadomeščati'))
        if 'zacetek_nadomescanja' not in request.data.keys():
            podatki_manjkajo = True
            manjkajoci['zacetek_nadomescanja'] = 'Podatek o začetnem datumu nadomeščanja manjka'
        else:
            try:
                zacetek_nadomescanja = parse(request.data['zacetek_nadomescanja']).replace(hour=0, minute=0, second=0)
                if danes.date() > zacetek_nadomescanja.date():
                    pretekli_datum = True;
                    pretekli_polja['zacetek_nadomescanja'] = 'Datum začetka nadomeščanja ne more biti v preteklosti'
            except ValueError:
                naroben_format_datuma = True
                format_problemi['zacetek_nadomescanja'] = "Začetek nadomeščanja nima veljavne oblike datuma"
        if 'konec_nadomescanja' not in request.data.keys():
            podatki_manjkajo = True
            manjkajoci['konec_nadomescanja'] = 'Podatek o končnem datumu nadomeščanja manjka'
        else:
            try:
                konec_nadomescanja = parse(request.data['konec_nadomescanja']).replace(hour=0, minute=0, second=0)
                if danes.date() > konec_nadomescanja.date():
                    pretekli_datum = True
                    pretekli_polja['konec_nadomescanja'] = 'Datum konca nadomeščanja ne more biti v preteklosti'
            except ValueError:
                naroben_format_datuma = True
                format_problemi['konec_nadomescanja'] = "Konec nadomeščanja nima veljavne oblike datuma"
        # Ce je manjkal kaksen podatek, obvesti odjemalca
        if podatki_manjkajo:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=manjkajoci)
        # Obvesti odjemalca, ce ni bil datum pravilnega formata
        if naroben_format_datuma:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=format_problemi)
        # Obvesti odjemalca o datumih v preteklosti
        if pretekli_datum:
            return Response(status=status.HTTP_400_BAD_REQUEST, data=pretekli_polja)
        # Preveri, da je koncni datum vecji ali enak zacetnemu
        if konec_nadomescanja.date() < zacetek_nadomescanja.date():
            sporocilo = dict(message='Končni datum mora biti večji ali enak začetnemu')
            return Response(status=status.HTTP_400_BAD_REQUEST, data=sporocilo)

        try:
            sestra = Uporabnik.objects.get(pk=pk)
        except Uporabnik.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data=dict(message='Ne najdem uporabnika, ki je odsoten'))
        try:
            sestra_delavec = PatronaznaSestraSerializer(sestra, context=context)
            if sestra_delavec.data['naziv_delavca'] != 'patronažna sestra':
                return Response(status=status.HTTP_400_BAD_REQUEST, data=dict(message='Uporabnik, ki naj bi bil odsoten, ni patronažna sestra'))
            # Vedno bosta podana zacetek in konec odsotnosti (!)
            if nadomestna_sestra_delavec.data['zacetek_odsotnosti'] is not None:
                nadomestna_sestra_zacetek_ods = parse(nadomestna_sestra_delavec.data['zacetek_odsotnosti']).date()
                nadomestna_sestra_konec_ods = parse(nadomestna_sestra_delavec.data['konec_odsotnosti']).date()
                # Zacetek nadomescanja je vsebovan v intervalu odsotnosti
                if zacetek_nadomescanja.date() >= nadomestna_sestra_zacetek_ods and zacetek_nadomescanja.date() <= nadomestna_sestra_konec_ods:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=dict(message='Nadomeščanje se začne, ko je nadomestna sestra že odsotna'))
                # Nadomescanje se dogaja, ko je sestra cel cas odsotna
                if konec_nadomescanja.date() >= nadomestna_sestra_zacetek_ods and konec_nadomescanja.date() <= nadomestna_sestra_konec_ods:
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=dict(message='Nadomeščanje se konča, ko je nadomestna sestra še odsotna'))
                # Odsotnost sestre je v celoti vsebovano v casu nadomescanja
                if nadomestna_sestra_zacetek_ods >= zacetek_nadomescanja.date() and nadomestna_sestra_konec_ods <= konec_nadomescanja.date():
                    return Response(status=status.HTTP_400_BAD_REQUEST, data=dict(message='Nadomestna sestra je odsotna v obdobju nadomeščanja'))
        except Delavec.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND, data=dict(message='Ne najdem delavca, ki je odsoten'))
        # Preveri obiske, ki so prvotno bili dodeljeni sestri
        obiski = Obisk.objects.filter(patronazna_sestra=sestra, predvideni_datum__range=[zacetek_nadomescanja, konec_nadomescanja]).update(nadomestna_patronazna_sestra=nadomestna_sestra)
        #obiski_serializer = ObiskSerializer(obiski, many=True, context=context)
        # Popravi obiske, pri katerih je nadomestna sestra naša prvotna sestra
        obiski_nadomesca = Obisk.objects.filter(nadomestna_patronazna_sestra=sestra, predvideni_datum__range=[zacetek_nadomescanja, konec_nadomescanja]).update(nadomestna_patronazna_sestra=nadomestna_sestra)
        Delavec.objects.filter(uporabnik=sestra).update(zacetek_odsotnosti=zacetek_nadomescanja, konec_odsotnosti=konec_nadomescanja)
        body = dict(nadomestni=obiski_nadomesca, obiski=obiski, message='Nadomestna sestra je bila dodana')
        return Response(status=status.HTTP_200_OK, data=body)

    @detail_route(methods=['patch'])
    def vrni(self, request, *args, **kwargs):
        '''Dodeli nerealizirane obiske nazaj prvostni sestri'''
        # ID uporabnika sestre, ki se je vrnila
        pk = kwargs.pop('pk', None)
        context = {"request": request,}
        sestra = None
        try:
            sestra = Uporabnik.objects.get(id=pk)
        except Uporabnik.DoesNotExist:
            body = dict(message='Ne najdem tega uporabnika')
            return Response(status=status.HTTP_404_NOT_FOUND, data=body)
        sestra_delavec = PatronaznaSestraSerializer(sestra, context=context)
        if sestra_delavec.data['naziv_delavca'] != 'patronažna sestra':
            return Response(status=status.HTTP_400_BAD_REQUEST, data=dict(message='Uporabnik ni patronažna sestra'))

        obiski = Obisk.objects.filter(patronazna_sestra=sestra, predvideni_datum__range=[sestra_delavec.data['zacetek_odsotnosti'], date.today()], je_opravljen=False).update(nadomestna_patronazna_sestra=None)
        Delavec.objects.filter(uporabnik=sestra).update(zacetek_odsotnosti=None, konec_odsotnosti=None)
        #print(obiski)
        body = dict(obiski=obiski, message='Obiski so bili dodeljeni nazaj k prvotni sestri')
        return Response(status=status.HTTP_200_OK, data=body)

class PatronazneSestreViewSet(viewsets.ReadOnlyModelViewSet):
    '''Vrne vse Patronazne sestre'''
    serializer_class = ZdravnikSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Delavec.objects.filter(
            Q(vrsta_delavca__naziv='patronažna sestra')
        )
        return queryset

class PozabljenoGesloViewSet(viewsets.ModelViewSet):

	serializer_class = PozabljenoGesloSerializer
	queryset = Uporabnik.objects.all()

class PotrditevGeslaViewSet(viewsets.ModelViewSet):

	serializer_class = PotrditevGeslaSerializer
	queryset = Uporabnik.objects.all()

class VracujoceSestreViewSet(viewsets.ReadOnlyModelViewSet):
    '''Vrne sestre, katerih odsotnost se konca na danasnji datum'''
    serializer_class = PatronaznaSestraDelavecSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Delavec.objects.filter(
            Q(vrsta_delavca__naziv='patronažna sestra')
        ).filter(konec_odsotnosti__date=date.today())
        return queryset
		
class PosodobiOsebjeViewSet(viewsets.ModelViewSet):

	serializer_class = PosodobiOsebjeSerializer
	queryset = Delavec.objects.all()
