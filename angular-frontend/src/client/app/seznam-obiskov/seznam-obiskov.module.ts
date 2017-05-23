import { NgModule } from '@angular/core';
import { SeznamObiskovComponent } from './seznam-obiskov.component';
import { SeznamObiskovRoutingModule } from './seznam-obiskov-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, ButtonModule,
    AutoCompleteModule, DialogModule, CheckboxModule} from 'primeng/primeng'

@NgModule({
  imports: [SeznamObiskovRoutingModule, SharedModule.forRoot(), ReactiveFormsModule, CalendarModule, ButtonModule, DialogModule,
      AutoCompleteModule, CheckboxModule],
  declarations: [SeznamObiskovComponent],
  exports: [SeznamObiskovComponent]
})
export class SeznamObiskovModule { }
