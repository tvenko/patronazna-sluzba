import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PosodobiOsebjePodrobnostiComponent } from './posodobi-osebje-podrobnosti.component';
import { AuthGuard } from '../guards/auth.guard';
import { RegistracijaDelavcaGuard } from '../guards/registracijaDelavca.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'posodobi-osebje/:osebnaSifra', component: PosodobiOsebjePodrobnostiComponent, canActivate: [AuthGuard, RegistracijaDelavcaGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class PosodobiOsebjePodrobnostiRoutingModule { }
