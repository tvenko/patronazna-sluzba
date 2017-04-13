import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegPacientComponent } from './reg-pacient.component';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'oskrbovani-pacient', component: RegPacientComponent }
    ])
  ],
  exports: [RouterModule]
})
export class RegPacientRoutingModule { }
