import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KreirajNalogComponent } from './kreiraj-nalog.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'nalogi/nov', component: KreirajNalogComponent }
    ])
  ],
  exports: [RouterModule]
})
export class KreirajNalogRoutingModule { }
