import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MeritveVnosComponent } from './meritve-vnos.component';
import { MeritveVnosRoutingModule } from './meritve-vnos-routing.module';

@NgModule({
  imports: [SharedModule.forRoot(), MeritveVnosRoutingModule],
  declarations: [MeritveVnosComponent],
  exports: [MeritveVnosComponent]
})
export class MeritveVnosModule { }
