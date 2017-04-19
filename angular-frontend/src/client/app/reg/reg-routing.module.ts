import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegComponent } from './reg.component';
import { AuthGuard } from '../guards/auth.guard';
import { RegistracijaDelavcaGuard } from '../guards/registracijaDelavca.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'reg', component: RegComponent, canActivate: [AuthGuard, RegistracijaDelavcaGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class RegRoutingModule { }
