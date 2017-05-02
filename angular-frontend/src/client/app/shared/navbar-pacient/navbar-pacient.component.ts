import { Component, OnInit } from '@angular/core';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar-pacient',
  templateUrl: 'navbar-pacient.component.html',
  styleUrls: ['navbar-pacient.component.css'],
})
export class NavbarPacientComponent implements OnInit{
  public pacient: any;

  ngOnInit() {
    // on init
    this.pacient = JSON.parse(localStorage.getItem('podatkiPacienta'));
    let datum = JSON.parse(localStorage.getItem('currentUser'));
    if (datum)
      this.pacient.datum = datum.datum;
    if (!this.pacient) {
      this.pacient = {};
      this.pacient.ime = "David";
      this.pacient.priimek = "Rubin";

    }
  }
}
