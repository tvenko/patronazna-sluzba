import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PosodobiOsebjeComponent } from './posodobi-osebje.component';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'posodobi-osebje', component: PosodobiOsebjeComponent, canActivate: [AuthGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class PosodobiOsebjeRoutingModule { }
