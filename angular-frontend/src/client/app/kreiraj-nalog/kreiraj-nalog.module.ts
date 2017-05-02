import { NgModule } from '@angular/core';
import { KreirajNalogComponent } from './kreiraj-nalog.component';
import { KreirajNalogRoutingModule } from './kreiraj-nalog-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AlertModule } from 'ng2-bootstrap/alert';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, RadioButtonModule, ButtonModule, DialogModule,
    AutoCompleteModule, CheckboxModule } from 'primeng/primeng';

@NgModule({
  imports: [KreirajNalogRoutingModule, SharedModule.forRoot(), AlertModule.forRoot(),
      ReactiveFormsModule, CalendarModule, RadioButtonModule, DialogModule,
      AutoCompleteModule, CheckboxModule],
  declarations: [KreirajNalogComponent],
  exports: [KreirajNalogComponent]
})
export class KreirajNalogModule { }
