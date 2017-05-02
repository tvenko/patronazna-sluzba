import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { PotrditevRegistracijeComponent } from './potrditev-registracije.component';
import { PotrditevRegistracijeRoutingModule } from './potrditev-registracije-routing.module';

@NgModule({
  declarations: [
    PotrditevRegistracijeComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
	PotrditevRegistracijeRoutingModule
  ],
  exports: [PotrditevRegistracijeComponent]
})
export class PotrditevRegistracijeModule { }
