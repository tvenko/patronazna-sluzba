import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ObiskiComponent } from './obiski.component';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'obiski', component: ObiskiComponent, canActivate: [AuthGuard, ] }
    ])
  ],
  exports: [RouterModule]
})
export class ObiskiRoutingModule { }
