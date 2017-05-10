import { NgModule } from '@angular/core';
import { PodrobnostiNalogComponent } from './podrobnosti-nalog.component';
import { PodrobnostiNalogRoutingModule } from './podrobnosti-nalog-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [PodrobnostiNalogRoutingModule, SharedModule.forRoot(),],
  declarations: [PodrobnostiNalogComponent],
  exports: [PodrobnostiNalogComponent]
})
export class PodrobnostiNalogModule { }
