import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';

import { RegComponent } from './reg.component';
import { RegRoutingModule } from './reg-routing.module';
import { EqualValidator } from './validacija';
import { DialogModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    RegComponent, EqualValidator
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
	  RegRoutingModule,
    SharedModule.forRoot(),
    DialogModule
  ],
  exports: [RegComponent]
})
export class RegModule { }
