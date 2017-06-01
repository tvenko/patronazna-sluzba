import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeznamObiskovPacientComponent } from './seznam-obiskov-pacient.component';
import { AuthGuard } from '../guards/auth.guard';
import { PregledNalogovGuard } from '../guards/pregledNalogov.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'seznam-obiskov-pacient', component: SeznamObiskovPacientComponent, canActivate: [AuthGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class SeznamObiskovPacientRoutingModule { }
