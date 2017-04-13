import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DelovniNalogComponent } from './delovni-nalog.component';
import { AuthGuard } from '../guards/auth.guard';
import { PregledNalogovGuard } from '../guards/pregledNalogov.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'nalogi', component: DelovniNalogComponent, canActivate: [AuthGuard, PregledNalogovGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class DelovniNalogRoutingModule { }
