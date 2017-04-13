import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KreirajNalogComponent } from './kreiraj-nalog.component';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'nalogi/nov', component: KreirajNalogComponent, canActivate: [AuthGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class KreirajNalogRoutingModule { }
