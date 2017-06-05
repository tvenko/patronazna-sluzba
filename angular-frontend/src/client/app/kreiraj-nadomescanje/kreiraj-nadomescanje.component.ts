import { Component, OnInit } from '@angular/core';
import { Pacient, Zdravilo, DelovniNalog, Material } from '../shared/models/index';
import { DelavecService } from '../shared/services/index';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'sd-nadomescanje-kreiraj',
  templateUrl: 'kreiraj-nadomescanje.component.html',
  styleUrls: ['kreiraj-nadomescanje.component.css']
})
export class KreirajNadomescanjeComponent implements OnInit {
  public seznamSester: any;
  public seznamMoznihNadomestnihSester: any;
  public formaNadomestneSestre: FormGroup;
  public today: Date;
  public minimalenDatumKonca: Date;
  public si: any;
  public response: any;
  public error: any;
  public loading: boolean = false;

  constructor(private delavecService: DelavecService,
              private _fb: FormBuilder) {}

  ngOnInit() {
    this.today = new Date();
    this.minimalenDatumKonca = this.today;
    this.delavecService.getMS().subscribe(
      response => {
        this.seznamSester = response;
        //console.log(response);
      }, error => {
        console.log('Napaka pri pridobivanju seznama patronažnih sester');
        //console.log(error);
      }
    );
    this.formaNadomestneSestre = this._fb.group({
      patronazna_sestra: ['', Validators.required],
      nadomestna_patronazna_sestra: ['', Validators.required],
      zacetek_nadomescanja: ['', Validators.required],
      konec_nadomescanja: ['', Validators.required]
    });
    // Lokalizacija za izbiro datuma
    this.si = {
      firstDayOfWeek: 0,
      dayNames: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
      dayNamesShort: ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'],
      dayNamesMin: ['Ne','Po','To','Sr','Če','Pe','So'],
      monthNames: [ 'Januar','Februar','Marec','April','Maj','Junij','Julij','Avgust','September','Oktober','November','December' ],
      monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun','Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec' ]
    };
    this.formaNadomestneSestre.controls.zacetek_nadomescanja.valueChanges.subscribe(
      data => {
          // Vrednost konca se ni bila izbrana
          if (!this.formaNadomestneSestre.controls.konec_nadomescanja.value) {
            //console.log("Datum konca se ni nastavljen");
            this.minimalenDatumKonca = data;
          } else if (Date.parse(this.formaNadomestneSestre.controls.konec_nadomescanja.value) < Date.parse(data)) {
            this.minimalenDatumKonca = data;
            //console.log("Datum je nastavljen na manjsi od zacetka")
            this.formaNadomestneSestre.controls.konec_nadomescanja.setValue(data);
          } else {
            this.minimalenDatumKonca = data;
          }
      }
    );
    this.formaNadomestneSestre.controls.patronazna_sestra.valueChanges.subscribe(
      data => {
        if (this.formaNadomestneSestre.controls.nadomestna_patronazna_sestra.value === data) {
          this.formaNadomestneSestre.controls.nadomestna_patronazna_sestra.setValue(null);
        }
        //console.log("Rezem izbrano sestro")
        let indexOdsotne = this.seznamSester.indexOf(data);
        this.seznamMoznihNadomestnihSester = this.seznamSester.slice();
        this.seznamMoznihNadomestnihSester.splice(indexOdsotne, 1);

      }
    );
  }

  /**
  * Doda novo nadomescanje sestre
  */
  poslji(vrednosti: any) {
    this.response = null;
    this.error = null;
    this.loading = true;
    //console.log(vrednosti);
    //console.log(this.formaNadomestneSestre)
    let body = <any>{};
    body.konec_nadomescanja = vrednosti.konec_nadomescanja;
    body.zacetek_nadomescanja = vrednosti.zacetek_nadomescanja;
    body.nadomestna_patronazna_sestra = vrednosti.nadomestna_patronazna_sestra.sifra_uporabnika;
    this.delavecService.nadomestiMS(vrednosti.patronazna_sestra.sifra_uporabnika, body)
      .subscribe(
        response => {
          let stObiskov = parseInt(response.obiski) + parseInt(response.nadomestni);
          this.response = response.message + ' (' + stObiskov + ' obiskov)';
          this.loading = false;
          //console.log(response);
        }, error => {
          this.loading = false;
          this.error = JSON.parse(error._body).message;
          //console.log(error);
        }
      );
  }
}
