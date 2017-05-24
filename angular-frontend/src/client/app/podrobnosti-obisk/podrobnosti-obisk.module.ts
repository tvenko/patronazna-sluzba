import { NgModule } from '@angular/core';
import { PodrobnostiObiskComponent } from './podrobnosti-obisk.component';
import { PodrobnostiObiskRoutingModule } from './podrobnosti-obisk-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [PodrobnostiObiskRoutingModule, SharedModule.forRoot(),],
  declarations: [PodrobnostiObiskComponent],
  exports: [PodrobnostiObiskComponent]
})
export class PodrobnostiObiskModule { }
