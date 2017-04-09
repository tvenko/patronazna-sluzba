import { NgModule } from '@angular/core';
import { DelovniNalogComponent } from './delovni-nalog.component';
import { DelovniNalogRoutingModule } from './delovni-nalog-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [DelovniNalogRoutingModule, SharedModule.forRoot()],
  declarations: [DelovniNalogComponent],
  exports: [DelovniNalogComponent]
})
export class DelovniNalogModule { }
