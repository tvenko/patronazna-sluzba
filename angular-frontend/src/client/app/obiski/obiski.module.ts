import { NgModule } from '@angular/core';
import { ObiskiComponent } from './obiski.component';
import { ObiskiRoutingModule } from './obiski-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AccordionModule, SharedModule as primengSharedModule, CalendarModule, PaginatorModule, DialogModule } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keyValues'})
export class KeysPipe implements PipeTransform {
  transform(value: any, args:string[]) : any {
    var keys = [];
    for (var key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}

@NgModule({
  imports: [ObiskiRoutingModule, SharedModule.forRoot(), AccordionModule, primengSharedModule, CalendarModule, PaginatorModule, DialogModule],
  declarations: [ObiskiComponent, KeysPipe],
  exports: [ObiskiComponent]
})
export class ObiskiModule { }
