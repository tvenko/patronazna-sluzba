import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DostopComponent } from './ni-dostopa.component';
import { DostopRoutingModule } from './ni-dostopa-routing.module';

@NgModule({
  declarations: [
    DostopComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
	DostopRoutingModule
  ],
  exports: [DostopComponent]
})
export class DostopModule { }
