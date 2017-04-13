import { NgModule } from '@angular/core';
import { PacientProfilComponent } from './pacient-profil.component';
import { PacientProfilRoutingModule } from './pacient-profil-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AlertModule } from 'ng2-bootstrap/alert';

@NgModule({
  imports: [PacientProfilRoutingModule, SharedModule.forRoot(), AlertModule.forRoot() ],
  declarations: [PacientProfilComponent],
  exports: [PacientProfilComponent]
})
export class PacientProfilModule { }
