import { NgModule } from '@angular/core';
import { SeznamObiskovPacientComponent } from './seznam-obiskov-pacient.component';
import { SeznamObiskovPacientRoutingModule } from './seznam-obiskov-pacient-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, ButtonModule,
    AutoCompleteModule, DialogModule, CheckboxModule} from 'primeng/primeng'

@NgModule({
  imports: [SeznamObiskovPacientRoutingModule, SharedModule.forRoot(), ReactiveFormsModule, CalendarModule, ButtonModule, DialogModule,
      AutoCompleteModule, CheckboxModule],
  declarations: [SeznamObiskovPacientComponent],
  exports: [SeznamObiskovPacientComponent]
})
export class SeznamObiskovPacientModule { }
