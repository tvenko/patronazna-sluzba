import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NameListService } from './name-list/name-list.service';
import { PacientService, DelovniNalogService, AuthenticationService, DelavecService, PotrditevRegistracijeService } from './services/index';
import { NavbarPacientComponent } from './navbar-pacient/navbar-pacient.component';
import { NavbarVodjaZdravnikComponent } from './navbar-vodja-zdravnik/navbar-vodja-zdravnik.component';
import { NavbarZunajComponent } from './navbar-zunaj/navbar-zunaj.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [ToolbarComponent, NavbarComponent, NavbarPacientComponent,
    NavbarVodjaZdravnikComponent, NavbarZunajComponent],
  exports: [ToolbarComponent, NavbarComponent,
    CommonModule, FormsModule, RouterModule, NavbarPacientComponent,
    NavbarVodjaZdravnikComponent, NavbarZunajComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService, PacientService, DelovniNalogService, DelavecService, AuthenticationService, PotrditevRegistracijeService]
    };
  }
}
