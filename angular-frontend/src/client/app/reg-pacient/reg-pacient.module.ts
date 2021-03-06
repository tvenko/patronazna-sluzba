import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';

import { RegPacientComponent } from './reg-pacient.component';
import { RegPacientRoutingModule } from './reg-pacient-routing.module';
import { EqualValidator } from './validacija';
import { CalendarModule, RadioButtonModule, DialogModule, ButtonModule,
  CheckboxModule, AutoCompleteModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    RegPacientComponent, EqualValidator
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
	RegPacientRoutingModule,
  CalendarModule, RadioButtonModule, DialogModule, ButtonModule,
    SharedModule.forRoot(), CheckboxModule, AutoCompleteModule
  ],
  exports: [RegPacientComponent]
})
export class RegPacientModule { }
