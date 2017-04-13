import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DelovniNalogComponent } from './delovni-nalog.component';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'nalogi', component: DelovniNalogComponent, canActivate: [AuthGuard] }
    ])
  ],
  exports: [RouterModule]
})
export class DelovniNalogRoutingModule { }
