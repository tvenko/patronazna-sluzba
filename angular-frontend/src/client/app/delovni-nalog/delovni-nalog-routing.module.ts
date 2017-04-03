import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DelovniNalogComponent } from './delovni-nalog.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'nalogi', component: DelovniNalogComponent }
    ])
  ],
  exports: [RouterModule]
})
export class DelovniNalogRoutingModule { }
