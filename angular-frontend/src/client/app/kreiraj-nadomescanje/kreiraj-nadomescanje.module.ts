import { NgModule } from '@angular/core';
import { KreirajNadomescanjeComponent } from './kreiraj-nadomescanje.component';
import { KreirajNadomescanjeRoutingModule } from './kreiraj-nadomescanje-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, ButtonModule } from 'primeng/primeng';

@NgModule({
  imports: [KreirajNadomescanjeRoutingModule, SharedModule.forRoot(), ReactiveFormsModule,
  CalendarModule, ButtonModule],
  declarations: [KreirajNadomescanjeComponent],
  exports: [KreirajNadomescanjeComponent]
})
export class KreirajNadomescanjeModule { }
