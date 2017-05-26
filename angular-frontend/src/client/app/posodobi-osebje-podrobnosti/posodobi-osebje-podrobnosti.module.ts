import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';

import { PosodobiOsebjePodrobnostiComponent } from './posodobi-osebje-podrobnosti.component';
import { PosodobiOsebjePodrobnostiRoutingModule } from './posodobi-osebje-podrobnosti-routing.module';
import { EqualValidator } from './validacija';
import { DialogModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    PosodobiOsebjePodrobnostiComponent, EqualValidator
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
	PosodobiOsebjePodrobnostiRoutingModule,
    SharedModule.forRoot(),
    DialogModule
  ],
  exports: [PosodobiOsebjePodrobnostiComponent]
})
export class PosodobiOsebjePodrobnostiModule { }
