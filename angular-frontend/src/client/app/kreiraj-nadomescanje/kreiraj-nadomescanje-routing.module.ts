import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KreirajNadomescanjeComponent } from './kreiraj-nadomescanje.component';
import { AuthGuard } from '../guards/auth.guard';
import { NadomescanjeMSGuard } from '../guards/nadomescanje-MS.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'nadomescanja/novo', component: KreirajNadomescanjeComponent, canActivate: [AuthGuard, NadomescanjeMSGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class KreirajNadomescanjeRoutingModule { }
