import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, ButtonModule, MessagesModule } from 'primeng/primeng';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';
import { DelovniNalogModule } from './delovni-nalog/delovni-nalog.module';
import { KreirajNalogModule } from './kreiraj-nalog/kreiraj-nalog.module';
import { RegModule } from './reg/reg.module';
import { RegPacientModule } from './reg-pacient/reg-pacient.module';
import { OskrbovaniPacientModule } from './oskrbovani-pacient/oskrbovani-pacient.module';
import { PacientProfilModule } from './pacient-profil/pacient-profil.module';
import { AuthenticationService } from './shared/services/avtentikacija/authentication.service';
import { PrijavaComponent } from './prijava/prijava.component';
import { PrijavaRoutingModule } from './prijava/prijava-routing.module';
import { DostopModule } from './ni-dostopa/ni-dostopa.module';
import { AuthGuard } from './guards/auth.guard';
import { KreiranjeNalogaGuard } from './guards/kreiranjeNaloga.guard';
import { PregledNalogovGuard } from './guards/pregledNalogov.guard';
import { RegistracijaDelavcaGuard } from './guards/registracijaDelavca.guard';
import { RegistracijaOskrbovancaGuard } from './guards/registracijaOskrbovanca.guard';
import { NadomescanjeMSGuard } from './guards/nadomescanje-MS.guard';
import { PotrditevRegistracijeModule } from './potrditev-registracije/potrditev-registracije.module';
import { ObiskiModule } from './obiski/obiski.module';
import { SpremembaPodatkovModule } from './sprememba-podatkov/sprememba-podatkov.module';
import { PodrobnostiNalogModule } from './podrobnosti-nalog/podrobnosti-nalog.module';
import { MeritveVnosModule } from './meritve-vnos/meritve-vnos.module';
import { PozabljenoGesloModule } from './pozabljeno-geslo/pozabljeno-geslo.module';
import { PotrditevGeslaModule } from './potrditev-gesla/potrditev-gesla.module';
import { SeznamObiskovModule } from './seznam-obiskov/seznam-obiskov.module';
import { SeznamObiskovPacientModule } from './seznam-obiskov-pacient/seznam-obiskov-pacient.module';
import { KreirajNadomescanjeModule } from './kreiraj-nadomescanje/kreiraj-nadomescanje.module'
import { PosodobiOsebjeModule } from './posodobi-osebje/posodobi-osebje.module'
import { PosodobiOsebjePodrobnostiModule } from './posodobi-osebje-podrobnosti/posodobi-osebje-podrobnosti.module'
import { PodrobnostiObiskModule } from './podrobnosti-obisk/podrobnosti-obisk.module';
import { ZakljuciNadomescanjeModule } from './zakljuci-nadomescanje/zakljuci-nadomescanje.module';

@NgModule({
  imports: [BrowserModule, HttpModule, AppRoutingModule, HomeModule, SharedModule.forRoot(),
    DelovniNalogModule, KreirajNalogModule, ReactiveFormsModule, FormsModule, CalendarModule, ButtonModule,
    MessagesModule, BrowserAnimationsModule, RegModule, RegPacientModule,
    PrijavaRoutingModule, OskrbovaniPacientModule, PacientProfilModule,
	PozabljenoGesloModule, PotrditevGeslaModule,
    DostopModule, PotrditevRegistracijeModule, ObiskiModule, SpremembaPodatkovModule,
    PodrobnostiNalogModule, MeritveVnosModule, SeznamObiskovModule, KreirajNadomescanjeModule,
	PosodobiOsebjeModule, PosodobiOsebjePodrobnostiModule, PodrobnostiObiskModule, SeznamObiskovPacientModule,
    ZakljuciNadomescanjeModule,],
  declarations: [AppComponent, PrijavaComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  },
    {
    provide: LOCALE_ID,
    useValue: 'sl-SI' },
  AuthenticationService, AuthGuard, KreiranjeNalogaGuard, PregledNalogovGuard,
  RegistracijaDelavcaGuard, RegistracijaOskrbovancaGuard, NadomescanjeMSGuard],
  bootstrap: [AppComponent]

})
export class AppModule { }
