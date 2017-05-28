import { NgModule } from '@angular/core';
import { ObiskiComponent } from './obiski.component';
import { ObiskiRoutingModule } from './obiski-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AccordionModule, SharedModule as primengSharedModule, CalendarModule, PaginatorModule, DialogModule } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'material'})
export class MaterialPipe implements PipeTransform {
  transform(value: any): any {
    return JSON.stringify(value, null, 2)
      .replace('{', '')
      .replace('}', '')
      .replace('"', '')
      .replace('"', '')
  }
}

@NgModule({
  imports: [ObiskiRoutingModule, SharedModule.forRoot(), AccordionModule, primengSharedModule, CalendarModule, PaginatorModule, DialogModule],
  declarations: [ObiskiComponent, MaterialPipe],
  exports: [ObiskiComponent]
})
export class ObiskiModule { }
