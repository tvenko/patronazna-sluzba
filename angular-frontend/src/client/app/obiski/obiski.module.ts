import { NgModule } from '@angular/core';
import { ObiskiComponent } from './obiski.component';
import { ObiskiRoutingModule } from './obiski-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AccordionModule } from 'primeng/primeng';

@NgModule({
  imports: [ObiskiRoutingModule, SharedModule.forRoot(), AccordionModule],
  declarations: [ObiskiComponent],
  exports: [ObiskiComponent]
})
export class ObiskiModule { }
