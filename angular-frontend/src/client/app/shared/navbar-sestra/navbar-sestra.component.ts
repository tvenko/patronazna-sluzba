import { Component, OnInit } from '@angular/core';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar-sestra',
  templateUrl: 'navbar-sestra.component.html',
  styleUrls: ['navbar-sestra.component.css'],
})
export class NavbarSestraComponent implements OnInit {
  public uporabnik: any = {};
  ngOnInit() {
    this.uporabnik = JSON.parse(localStorage.getItem('currentUser'));
    let podrobnosti = JSON.parse(localStorage.getItem('podatkiIzvajalca'));
    if (podrobnosti) {
      this.uporabnik.ime = podrobnosti.ime;
      this.uporabnik.priimek = podrobnosti.priimek;
    }
  }
}
