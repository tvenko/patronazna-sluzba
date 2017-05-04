import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';

import { DostopComponent } from './ni-dostopa.component';
import { DostopRoutingModule } from './ni-dostopa-routing.module';

@NgModule({
  declarations: [
    DostopComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
	DostopRoutingModule,
  SharedModule.forRoot()
  ],
  exports: [DostopComponent]
})
export class DostopModule { }
