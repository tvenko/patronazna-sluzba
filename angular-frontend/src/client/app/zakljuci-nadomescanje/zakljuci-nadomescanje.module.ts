import { NgModule } from '@angular/core';
import { ZakljuciNadomescanjeComponent } from './zakljuci-nadomescanje.component';
import { ZakljuciNadomescanjeRoutingModule } from './zakljuci-nadomescanje-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/primeng';

@NgModule({
  imports: [ZakljuciNadomescanjeRoutingModule, SharedModule.forRoot(), ReactiveFormsModule, ButtonModule],
  declarations: [ZakljuciNadomescanjeComponent],
  exports: [ZakljuciNadomescanjeComponent]
})
export class ZakljuciNadomescanjeModule { }
