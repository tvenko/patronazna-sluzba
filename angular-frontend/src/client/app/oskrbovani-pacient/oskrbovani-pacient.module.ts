import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';

import { OskrbovaniPacientComponent } from './oskrbovani-pacient.component';
import { OskrbovaniPacientRoutingModule } from './oskrbovani-pacient-routing.module';
import { EqualValidator } from './validacija';
import { AlertModule } from 'ng2-bootstrap/alert';
import { CalendarModule, RadioButtonModule, DialogModule, ButtonModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    OskrbovaniPacientComponent, EqualValidator
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
	OskrbovaniPacientRoutingModule,
  CalendarModule, RadioButtonModule, DialogModule, ButtonModule,
    SharedModule.forRoot()
  ],
  exports: [OskrbovaniPacientComponent]
})
export class OskrbovaniPacientModule { }
