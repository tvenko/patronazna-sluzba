import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZakljuciNadomescanjeComponent } from './zakljuci-nadomescanje.component';
import { AuthGuard } from '../guards/auth.guard';
import { NadomescanjeMSGuard } from '../guards/nadomescanje-MS.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'nadomescanja/zakljuci', component: ZakljuciNadomescanjeComponent, canActivate: [AuthGuard, NadomescanjeMSGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class ZakljuciNadomescanjeRoutingModule { }
