import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PosodobiOsebjePodrobnostiComponent } from './posodobi-osebje-podrobnosti.component';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'posodobi-osebje/:osebnaSifra', component: PosodobiOsebjePodrobnostiComponent, canActivate: [AuthGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class PosodobiOsebjePodrobnostiRoutingModule { }
