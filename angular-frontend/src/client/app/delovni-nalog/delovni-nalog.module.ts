import { NgModule } from '@angular/core';
import { DelovniNalogComponent } from './delovni-nalog.component';
import { DelovniNalogRoutingModule } from './delovni-nalog-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, ButtonModule,
    AutoCompleteModule, DialogModule} from 'primeng/primeng'

@NgModule({
  imports: [DelovniNalogRoutingModule, SharedModule.forRoot(), ReactiveFormsModule, CalendarModule, ButtonModule, DialogModule,
      AutoCompleteModule],
  declarations: [DelovniNalogComponent],
  exports: [DelovniNalogComponent]
})
export class DelovniNalogModule { }
