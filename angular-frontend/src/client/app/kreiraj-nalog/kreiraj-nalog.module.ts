import { NgModule } from '@angular/core';
import { KreirajNalogComponent } from './kreiraj-nalog.component';
import { KreirajNalogRoutingModule } from './kreiraj-nalog-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AlertModule } from 'ng2-bootstrap/alert';

@NgModule({
  imports: [KreirajNalogRoutingModule, SharedModule, AlertModule.forRoot()],
  declarations: [KreirajNalogComponent],
  exports: [KreirajNalogComponent]
})
export class KreirajNalogModule { }
