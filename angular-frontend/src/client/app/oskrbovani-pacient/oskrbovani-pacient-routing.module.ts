import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OskrbovaniPacientComponent } from './oskrbovani-pacient.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'oskrbovani-pacient', component: OskrbovaniPacientComponent }
    ])
  ],
  exports: [RouterModule]
})
export class OskrbovaniPacientRoutingModule { }
