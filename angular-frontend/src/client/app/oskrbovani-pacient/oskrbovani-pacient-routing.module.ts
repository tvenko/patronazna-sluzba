import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegPacientComponent } from './oskrbovani-pacient.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'reg-pacient', component: RegPacientComponent }
    ])
  ],
  exports: [RouterModule]
})
export class RegPacientRoutingModule { }
