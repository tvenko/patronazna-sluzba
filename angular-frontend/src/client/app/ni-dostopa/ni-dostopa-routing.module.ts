import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DostopComponent } from './ni-dostopa.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'ni-dostopa', component: DostopComponent }
    ])
  ],
  exports: [RouterModule]
})
export class DostopRoutingModule { }
