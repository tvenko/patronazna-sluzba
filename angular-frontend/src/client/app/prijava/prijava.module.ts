import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { PrijavaComponent } from './prijava.component';
import { PrijavaRoutingModule } from './prijava-routing.module';

@NgModule({
  declarations: [
    PrijavaComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
	PrijavaRoutingModule
  ],
  exports: [PrijavaComponent]
})
export class PrijavaModule { }