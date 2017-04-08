import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RegPacientComponent } from './reg-pacient.component';
import { RegPacientRoutingModule } from './reg-pacient-routing.module';
import { EqualValidator } from './validacija';

@NgModule({
  declarations: [
    RegPacientComponent, EqualValidator
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
	RegPacientRoutingModule
  ],
  exports: [RegPacientComponent]
})
export class RegPacientModule { }
