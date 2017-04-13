import { NgModule } from '@angular/core';
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
import { AuthenticationService } from './shared/services/avtentikacija/authentication.service';
import { PrijavaComponent } from './prijava/prijava.component';
import { PrijavaRoutingModule } from './prijava/prijava-routing.module';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  imports: [BrowserModule, HttpModule, AppRoutingModule, HomeModule, SharedModule.forRoot(),
    DelovniNalogModule, KreirajNalogModule, ReactiveFormsModule, FormsModule, CalendarModule, ButtonModule,
    MessagesModule, BrowserAnimationsModule, RegModule, RegPacientModule,
	PrijavaRoutingModule],
  declarations: [AppComponent, PrijavaComponent,],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  },
  AuthenticationService, AuthGuard],
  bootstrap: [AppComponent]

})
export class AppModule { }
