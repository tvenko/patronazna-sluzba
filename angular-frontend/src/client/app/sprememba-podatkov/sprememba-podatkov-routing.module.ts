import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpremembaPodatkovComponent } from './sprememba-podatkov.component';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'pacient/sprememba', component: SpremembaPodatkovComponent, canActivate: [AuthGuard]}
    ])
  ],
  exports: [RouterModule]
})
export class SpremembaPodatkovRoutingModule { }
