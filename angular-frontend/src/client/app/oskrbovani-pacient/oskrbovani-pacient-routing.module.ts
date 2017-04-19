import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OskrbovaniPacientComponent } from './oskrbovani-pacient.component';
import { AuthGuard } from '../guards/auth.guard';
import { RegistracijaOskrbovancaGuard } from '../guards/registracijaOskrbovanca.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'oskrbovani-pacient', component: OskrbovaniPacientComponent, canActivate: [AuthGuard, RegistracijaOskrbovancaGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class OskrbovaniPacientRoutingModule { }
