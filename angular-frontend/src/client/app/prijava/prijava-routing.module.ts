import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrijavaComponent } from './prijava.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'prijava', component: PrijavaComponent }
    ])
  ],
  exports: [RouterModule]
})
export class PrijavaRoutingModule { }
