import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PotrditevGeslaComponent } from './potrditev-gesla.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'potrditev-gesla', component: PotrditevGeslaComponent }
    ])
  ],
  exports: [RouterModule]
})
export class PotrditevGeslaRoutingModule { }
