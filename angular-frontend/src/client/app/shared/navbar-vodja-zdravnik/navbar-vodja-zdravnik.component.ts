import { Component, OnInit } from '@angular/core';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar-vodja-zdravnik',
  templateUrl: 'navbar-vodja-zdravnik.component.html',
  styleUrls: ['navbar-vodja-zdravnik.component.css'],
})
export class NavbarVodjaZdravnikComponent implements OnInit {
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
