import { Component, OnInit } from '@angular/core';
import { vrstaObiska, Pacient } from '../shared/models/index';
import { PacientService } from '../shared/services/index';

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
  stevilkaPacienta: string;
  problemPridobivanja: boolean;
  neveljavnaStevilka: boolean;
  data: any [];

  constructor(public pacientInfoService: PacientService) {
    this.stevilkaPacienta = undefined;
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
            console.log(response.vezaniPacienti);
          },
          error => {
            this.problemPridobivanja = true;
          }

        );
    }
  }

}
