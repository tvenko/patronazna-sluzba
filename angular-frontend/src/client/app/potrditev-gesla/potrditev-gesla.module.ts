import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { PotrditevGeslaComponent } from './potrditev-gesla.component';
import { PotrditevGeslaRoutingModule } from './potrditev-gesla-routing.module';

@NgModule({
  declarations: [
    PotrditevGeslaComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
	PotrditevGeslaRoutingModule
  ],
  exports: [PotrditevGeslaComponent]
})
export class PotrditevGeslaModule { }
