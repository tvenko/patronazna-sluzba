import { NgModule } from '@angular/core';
import { PosodobiOsebjeComponent } from './posodobi-osebje.component';
import { PosodobiOsebjeRoutingModule } from './posodobi-osebje-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, ButtonModule,
    AutoCompleteModule, DialogModule} from 'primeng/primeng'

@NgModule({
  imports: [PosodobiOsebjeRoutingModule, SharedModule.forRoot(), ReactiveFormsModule, CalendarModule, ButtonModule, DialogModule,
      AutoCompleteModule],
  declarations: [PosodobiOsebjeComponent],
  exports: [PosodobiOsebjeComponent]
})
export class PosodobiOsebjeModule { }
