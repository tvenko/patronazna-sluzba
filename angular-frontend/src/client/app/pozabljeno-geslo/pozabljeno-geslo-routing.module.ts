import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PozabljenoGesloComponent } from './pozabljeno-geslo.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'pozabljeno-geslo', component: PozabljenoGesloComponent }
    ])
  ],
  exports: [RouterModule]
})
export class PozabljenoGesloRoutingModule { }
