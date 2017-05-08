import { Component, OnInit } from '@angular/core';
import { DelovniNalogService } from '../shared/services/index';
import { PacientService } from '../shared/services/index';
import { DelavecService } from '../shared/services/index';
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
  public imena: any;

  constructor(private delovniNalogService: DelovniNalogService, public pacientService: PacientService, public delavecService: DelavecService) {}

  ngOnInit() {
    this.pridobiNaloge();
  }

  public getName = function(id: any) {
    this.pacientService.get(id).subscribe(
      (response: any) => {
        //this.imena[dn].ime = response.ime+" "+response.priimek;
        //this.delovniNalogi[dn].ime_pacienta = response.ime+" "+response.priimek;
        console.log(response.ime+" "+response.priimek);
      });
  }

  getImenaPacientov(dn: any) {
    this.pacientService.get(this.delovniNalogi[dn].id_pacienta).subscribe(
      (response: any) => {
        this.delovniNalogi[dn].ime_pacienta = (response.ime+" "+response.priimek);
        dn++;
        if (dn == this.delovniNalogi.length) return;
        this.getImenaPacientov(dn);
      });
  }

  getImenaSester(dn: any) {
    this.delavecService.get(this.delovniNalogi[dn].patronazna_sestra).subscribe(
      (response: any) => {
        this.delovniNalogi[dn].ime_sestre = (response.ime+" "+response.priimek);
        dn++;
        if (dn == this.delovniNalogi.length) return;
        this.getImenaSester(dn);
      });
  }

  getImenaObiskov(dn: any) {
    this.delovniNalogService.getVrsteObiskovById(this.delovniNalogi[dn].vrsta_obiska).subscribe(
      (response: any) => {
        this.delovniNalogi[dn].ime_obiska = (response.opis);
        dn++;
        if (dn == this.delovniNalogi.length) return;
        this.getImenaObiskov(dn);
      });
  }

  pridobiNaloge() {
    let sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
    if (sifra_zdravnika) {
      sifra_zdravnika = JSON.parse(sifra_zdravnika).osebna_sifra;
      this.delovniNalogService.getByDelavec(sifra_zdravnika)
        .subscribe(
          response => {
            console.log(response.results);
            this.delovniNalogi = response.results;
            this.getImenaPacientov(0);
            this.getImenaSester(0);
            this.getImenaObiskov(0);
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
