import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeznamObiskovComponent } from './seznam-obiskov.component';
import { AuthGuard } from '../guards/auth.guard';
import { PregledNalogovGuard } from '../guards/pregledNalogov.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'seznam-obiskov', component: SeznamObiskovComponent, canActivate: [AuthGuard, PregledNalogovGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class SeznamObiskovRoutingModule { }
