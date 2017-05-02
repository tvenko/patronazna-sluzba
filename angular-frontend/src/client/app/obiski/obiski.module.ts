import { NgModule } from '@angular/core';
import { ObiskiComponent } from './obiski.component';
import { ObiskiRoutingModule } from './obiski-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [ObiskiRoutingModule, SharedModule.forRoot()],
  declarations: [ObiskiComponent],
  exports: [ObiskiComponent]
})
export class ObiskiModule { }
