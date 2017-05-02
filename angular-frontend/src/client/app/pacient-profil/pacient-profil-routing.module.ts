import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PacientProfilComponent } from './pacient-profil.component';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'pacient/profil', component: PacientProfilComponent, canActivate: [AuthGuard]}
    ])
  ],
  exports: [RouterModule]
})
export class PacientProfilRoutingModule { }
