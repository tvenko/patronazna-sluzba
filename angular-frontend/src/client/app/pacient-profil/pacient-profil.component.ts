import { Component, OnInit } from '@angular/core';
import { PacientService } from '../shared/services/index';

/**
* This class represents the lazy loaded DelovniNalogComponent.
*/
@Component({
  moduleId: module.id,
  selector: 'sd-pacient-profil',
  templateUrl: 'pacient-profil.component.html',
  styleUrls: ['pacient-profil.component.css']
})
export class PacientProfilComponent implements OnInit {
  public pacient: any;
  public uporabnik: any;

  constructor(public pacientService: PacientService) {}

  ngOnInit() {
    // on init
    this.pacient = JSON.parse(localStorage.getItem('podatkiPacienta'));
    if (!this.pacient) {
      this.pacient = {};
    }
	  this.uporabnik = JSON.parse(localStorage.getItem('currentUser'));
    if (!this.uporabnik)
      this.uporabnik = {};

    if (this.pacient) {
      this.pacientService.getVezancke(this.pacient.stevilkaPacienta)
        .subscribe(
          response => {
            this.pacient.vezaniPacienti = response.results;
            for (let vezancek of this.pacient.vezaniPacienti) {
              if (vezancek.spol)
                vezancek.spol = 'moški';
              else
                vezancek.spol = 'ženski';
            }
          },
          error => {

          }
        );
    }
  }
}
