import { Component, OnInit } from '@angular/core';
import { vrstaObiska, Pacient } from '../shared/models/index';
import { PacientInfoService } from '../shared/services/index';

/**
 * This class represents the lazy loaded DelovniNalogComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-nalog-kreiraj',
  templateUrl: 'kreiraj-nalog.component.html',
  styleUrls: ['kreiraj-nalog.component.css'],
})
export class KreirajNalogComponent implements OnInit {
  izbranaVrsta = new vrstaObiska;
  pacient = new Pacient;
  stevilkaPacienta: number;
  problemPridobivanja: boolean;
  neveljavnaStevilka: boolean;
  data: any [];

  constructor(public pacientInfoService: PacientInfoService) {
    this.stevilkaPacienta = undefined;
    console.log(this.neveljavnaStevilka);
  }

  ngOnInit() { }

  pridobiPodatke() {
    this.problemPridobivanja = false;
    if (!this.stevilkaPacienta) {
      this.neveljavnaStevilka = true;
    } else {
      this.neveljavnaStevilka = false;
      this.pacientInfoService.get(this.stevilkaPacienta)
        .subscribe(
          response => {
            this.pacient = response;
          },
          error => {
            this.problemPridobivanja = true;
          }

        );
    }
  }

}
