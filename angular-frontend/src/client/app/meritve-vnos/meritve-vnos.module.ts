import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MeritveVnosComponent } from './meritve-vnos.component';
import { MeritveVnosRoutingModule } from './meritve-vnos-routing.module';
import { CalendarModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule.forRoot(), MeritveVnosRoutingModule, CalendarModule],
  declarations: [MeritveVnosComponent],
  exports: [MeritveVnosComponent]
})
export class MeritveVnosModule { }
