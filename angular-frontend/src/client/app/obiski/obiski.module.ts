import { NgModule } from '@angular/core';
import { ObiskiComponent } from './obiski.component';
import { ObiskiRoutingModule } from './obiski-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AccordionModule, SharedModule as primengSharedModule, CalendarModule, PaginatorModule } from 'primeng/primeng';

@NgModule({
  imports: [ObiskiRoutingModule, SharedModule.forRoot(), AccordionModule, primengSharedModule, CalendarModule, PaginatorModule],
  declarations: [ObiskiComponent],
  exports: [ObiskiComponent]
})
export class ObiskiModule { }
