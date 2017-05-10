import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PodrobnostiNalogComponent } from './podrobnosti-nalog.component';
import { AuthGuard } from '../guards/auth.guard';
import { PregledNalogovGuard } from '../guards/pregledNalogov.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'nalogi/:idNaloga', component: PodrobnostiNalogComponent, canActivate: [ PregledNalogovGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class PodrobnostiNalogRoutingModule { }
