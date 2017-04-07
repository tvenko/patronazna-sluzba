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
import { PrijavaModule } from './prijava/prijava.module';
import { RegModule } from './reg/reg.module';

@NgModule({
  imports: [BrowserModule, HttpModule, AppRoutingModule, AboutModule, HomeModule, SharedModule.forRoot(),
    DelovniNalogModule, KreirajNalogModule, ReactiveFormsModule, FormsModule, CalendarModule, ButtonModule,
    MessagesModule, BrowserAnimationsModule, PrijavaModule, RegModule],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
