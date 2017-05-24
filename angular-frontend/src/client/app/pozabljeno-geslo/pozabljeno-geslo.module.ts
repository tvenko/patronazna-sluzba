import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import { PozabljenoGesloComponent } from './pozabljeno-geslo.component';
import { PozabljenoGesloRoutingModule } from './pozabljeno-geslo-routing.module';
import { EqualValidator } from './validacija';
import { DialogModule, ButtonModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    PozabljenoGesloComponent, EqualValidator
  ],
  imports: [
    BrowserModule,
    HttpModule,
	PozabljenoGesloRoutingModule,
	ReactiveFormsModule,
	DialogModule,
	ButtonModule
  ],
  exports: [PozabljenoGesloComponent]
})
export class PozabljenoGesloModule { }
