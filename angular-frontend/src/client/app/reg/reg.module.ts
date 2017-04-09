import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RegComponent } from './reg.component';
import { RegRoutingModule } from './reg-routing.module';
import { EqualValidator } from './validacija';

@NgModule({
  declarations: [
    RegComponent, EqualValidator
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
	RegRoutingModule
  ],
  exports: [RegComponent]
})
export class RegModule { }
