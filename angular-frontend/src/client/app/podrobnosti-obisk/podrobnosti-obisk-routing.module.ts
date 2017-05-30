import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PodrobnostiObiskComponent } from './podrobnosti-obisk.component';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'obiski/:idObiska', component: PodrobnostiObiskComponent, canActivate: [ AuthGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class PodrobnostiObiskRoutingModule { }
