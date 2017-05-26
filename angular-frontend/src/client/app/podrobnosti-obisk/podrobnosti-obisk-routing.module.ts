import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PodrobnostiObiskComponent } from './podrobnosti-obisk.component';
import { AuthGuard } from '../guards/auth.guard';
import { PregledNalogovGuard } from '../guards/pregledNalogov.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'obiski/:idObiska', component: PodrobnostiObiskComponent, canActivate: [ PregledNalogovGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class PodrobnostiObiskRoutingModule { }
