import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SpremembaPodatkovComponent } from './sprememba-podatkov.component';
import { SpremembaPodatkovRoutingModule } from './sprememba-podatkov-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AlertModule } from 'ng2-bootstrap/alert';
import { EqualValidator } from './validacija';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule, ButtonModule } from 'primeng/primeng';

@NgModule({
  imports: [SpremembaPodatkovRoutingModule, SharedModule.forRoot(), AlertModule.forRoot(),
    ReactiveFormsModule, DialogModule, ButtonModule ],
  declarations: [SpremembaPodatkovComponent, EqualValidator],
  exports: [SpremembaPodatkovComponent]
})
export class SpremembaPodatkovModule { }
