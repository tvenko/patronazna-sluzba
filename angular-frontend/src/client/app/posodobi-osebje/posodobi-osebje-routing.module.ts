import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PosodobiOsebjeComponent } from './posodobi-osebje.component';
import { AuthGuard } from '../guards/auth.guard';
import { RegistracijaDelavcaGuard } from '../guards/registracijaDelavca.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'posodobi-osebje', component: PosodobiOsebjeComponent, canActivate: [AuthGuard, RegistracijaDelavcaGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class PosodobiOsebjeRoutingModule { }
