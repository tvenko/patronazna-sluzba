import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { MeritveVnosComponent } from './meritve-vnos.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'meritve/vnos/:id', component: MeritveVnosComponent, canActivate: [AuthGuard, ] }
    ])
  ],
  exports: [RouterModule]
})
export class MeritveVnosRoutingModule { }
