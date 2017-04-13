import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KreirajNalogComponent } from './kreiraj-nalog.component';
import { AuthGuard } from '../guards/auth.guard';
import { KreiranjeNalogaGuard } from '../guards/kreiranjeNaloga.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'nalogi/nov', component: KreirajNalogComponent, canActivate: [AuthGuard, KreiranjeNalogaGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class KreirajNalogRoutingModule { }
