import { Component, OnInit } from '@angular/core';
import { DelovniNalogService } from '../shared/services/index';
/**
 * This class represents the lazy loaded DelovniNalogComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-nalog',
  templateUrl: 'delovni-nalog.component.html',
  styleUrls: ['delovni-nalog.component.css'],
})
export class DelovniNalogComponent implements OnInit {
  public delovniNalogi: any;

  constructor(private delovniNalogService: DelovniNalogService) {}

  ngOnInit() {
    this.pridobiNaloge();
  }

  pridobiNaloge() {
    let sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
    if (sifra_zdravnika) {
      sifra_zdravnika = JSON.parse(sifra_zdravnika).osebna_sifra;
      this.delovniNalogService.getByZdravnik(sifra_zdravnika)
        .subscribe(
          response => {
            this.delovniNalogi = response.results;
          },
          error => {
            // Pokazi obvestilo
          }
        );
    } else {
      console.log('Ni izvajalca v local storage');
    }

  }

}
