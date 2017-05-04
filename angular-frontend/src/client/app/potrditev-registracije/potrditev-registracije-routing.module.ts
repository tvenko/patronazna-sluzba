import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PotrditevRegistracijeComponent } from './potrditev-registracije.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'potrditev-registracije', component: PotrditevRegistracijeComponent }
    ])
  ],
  exports: [RouterModule]
})
export class PotrditevRegistracijeRoutingModule { }
