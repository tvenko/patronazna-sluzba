import { Component, OnInit } from '@angular/core';
import { Pacient, Zdravilo, DelovniNalog, Material } from '../shared/models/index';
import { PacientService, DelovniNalogService } from '../shared/services/index';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

/**
* This class represents the lazy loaded DelovniNalogComponent.
*/
@Component({
  moduleId: module.id,
  selector: 'sd-nalog-kreiraj',
  templateUrl: 'kreiraj-nalog.component.html',
  styleUrls: ['kreiraj-nalog.component.css']
})
export class KreirajNalogComponent implements OnInit {
  public pacient: any;
  public zdravila: any;
  public vrsteObiskov: any;
  public problemPridobivanja: boolean;
  public neveljavnaStevilka: boolean;
  public epruvete: any[];
  public myForm: FormGroup;
  public date: Date;
  public minDate: Date;
  public minDateKoncen: Date;
  public si: any;
  public interval: string;
  public pokaziPregled: boolean;
  public posljiNalog: boolean;
  public sporociloStreznika: boolean;
  public napakaStreznika: boolean;
  public zdravnik: any;
  public najdeniPacienti: any;
  //public prikazNajdenih: any[] = [];
  public stevilkaKartice: any;
  public vezanciPacienta: any = [];
  public izbraniVezanci: any = [];

  constructor(private pacientInfoService: PacientService,
    private delovniNalogService: DelovniNalogService,
    private _fb: FormBuilder) {
    }

    ngOnInit() {
      this.dobiVrsteObiskov();
      this.pridobiZdravila();
      this.pridobiEpruvete();
      this.pokaziPregled = false;
      this.posljiNalog = false;
      this.pacient = '';
      this.napakaStreznika = false;
      this.sporociloStreznika = false;

      // Inicializacija forme za dodajanje materiala
      this.myForm = this._fb.group({
        zdravila: this._fb.array([
          this.initZdravila(),
        ]),
        materiali: this._fb.array([
          this.initMaterial(),
        ]),
        prviDatum: ['', [Validators.required]],
        obdobjeObiskov: this.initObdobjeObiskovGroup(),
        steviloObiskov: ['', [Validators.required, Validators.pattern(/^([1-9]|10)$/)]],
        obvezen: ['false', [Validators.required]],
        vrstaObiska: ['', Validators.required],
        //stevilkaPacienta: ['', [Validators.required, Validators.pattern(/[a-zčćšđžA-Z]+\s[A-Za-zčćšđž]+\s\(\d+\)/)]],
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

      // Minimalen datum za izbiro obiska
      let today = new Date();
      this.minDate = new Date(today);
      this.subscribeSpremeboGumbovKoncnegaDatuma();
      this.izracunajMinimalenDatum();
      // Pridobi podatke o izvajalcu iz lokalne shrambe
      this.zdravnik = JSON.parse(localStorage.getItem('podatkiIzvajalca'));

      if (!this.zdravnik)
        this.zdravnik = {};
      else {
        this.zdravnik.sifra_bolnice = this.zdravnik.sifra_ustanove.slice(-5).substring(0,4);
      }

    }

    /**
    * Iskanje za autocomplete pri stevilki pacienta
    */
    search(event: any) {

       this.pacientInfoService.query(event.query)
        .subscribe(
          response => {
            this.najdeniPacienti = response.results;
            //this.prikazNajdenih = [];
            for (let najden of this.najdeniPacienti) {
              najden.naziv = najden.ime + ' ' + najden.priimek + ' ('+ najden.stevilkaPacienta +')';
              /*this.prikazNajdenih.push(najden.ime + ' ' + najden.priimek + ' (' + najden.stevilkaPacienta + ')'
              + ' ' + najden.ulica + ' ' + najden.hisnaStevilka + ', ' + najden.kraj);*/
            }

          },
          error => {
            console.log('Napaka pri iskanju pacienta');
          }
        );
   }


   /**
   * Event, ki se sprozi ko izberes iz autocomplete seznama
   */
   elementIzbran(event: any) {
     this.pacient = event;
     this.vezanciPacienta = [];
     this.pacientInfoService.getVezancke(event.stevilkaPacienta)
        .subscribe(
          response => {
            //this.vezanciPacienta = response.results;
            for (let otrok of response.results) {
              if (otrok.sorodstveno_razmerje == 19)
                this.vezanciPacienta.push(otrok);
            }
          },
          error => {
            console.log('Napaka pri pridobivanju vezanih pacientov');
          }
        );
   }


    /**
     * Pregled naloga preden je poslan (moznost preklica)
     */
    pregled() {
      // Pridobi podatke za pacienta
      if (!this.pacient || this.problemPridobivanja) {
          this.pridobiPodatke();
      }
      //console.log(this.izbraniVezanci);
      this.pokaziPregled = true;
    }


    /**
     * Poslji formo 'myForm' kot nov nalog na streznik
     * TODO preuredi formo da bo uporabljala ista imena spremenljivk
     */
    poslji() {
      let ctrl = (<any>this.myForm).controls;
      let novNalog = <any>{};
      // TODO Preberi iz seje
      novNalog.sifra_zdravnika = this.zdravnik.osebna_sifra;
      novNalog.id_pacienta = parseInt(this.pacient.stevilkaPacienta);;
      novNalog.vezani_pacienti = <any>[];
      if (ctrl.vrstaObiska.value.vezani_pacienti) {
        for (let vezancek of this.izbraniVezanci) {
          novNalog.vezani_pacienti.push(parseInt(vezancek));
        }
      }

      novNalog.datum_prvega_obiska = ctrl.prviDatum.value;
      novNalog.vrsta_obiska = ctrl.vrstaObiska.value.id;
      novNalog.stevilo_obiskov = ctrl.steviloObiskov.value;

      // Definiraj koncni datum ali intervale med njimi
      if (ctrl.obdobjeObiskov.value.type === 'zadnjiDan') {
        novNalog.casovno_obdobje = ctrl.obdobjeObiskov.controls.koncniDatum.value;
      } else {
        novNalog.casovni_interval = ctrl.obdobjeObiskov.controls.interval.value;
      }

      // Ce je potreba dodaj material (odvzem krvi)
      if (ctrl.vrstaObiska.value.id === 5) {
        novNalog.material = <any>[];
        for(var i=0; i<ctrl.materiali.controls.length; i++) {
          novNalog.material[i] = <any>{};
          novNalog.material[i].id_materiala = ctrl.materiali.controls[i]
            .controls.material.value.id;
          novNalog.material[i].kolicina = ctrl.materiali.controls[i].controls
            .kolicina.value;
        }
      }

      // Ce je potreba po zdravilih dopisi zdravila (pri aplikaciji injekcij)
      if (ctrl.vrstaObiska.value.id === 4) {
        novNalog.sifra_zdravila = <any>[];
        for (var i=0; i<ctrl.zdravila.controls.length; i++) {
          novNalog.sifra_zdravila[i] = ctrl.zdravila.controls[i].controls.zdravilo
            .value.sifra;
        }
      }

      // Ce je vrsta obiska obisk otrocnice, potem poslji se vezane paciente
      if (ctrl.vrstaObiska.value.id) {}

      if (ctrl.obvezen.value === 'true')
        novNalog.je_obvezen_datum = true;
      else
        novNalog.je_obvezen_datum = false;

      //console.log(JSON.stringify(novNalog));
      //console.log(novNalog);
      this.delovniNalogService.ustvari(novNalog)
        .subscribe(
          response => {

            this.sporociloStreznika = true;
            this.napakaStreznika = false;
          },
          error => {
            console.log(error);
            this.sporociloStreznika = false;
            this.napakaStreznika = true;
          }
        );
    }

    /**
    * Poslusaj za spremembo gumba za izbiro obdobja obiskov
    */
    subscribeSpremeboGumbovKoncnegaDatuma() {
      const obdobjeCtrl = (<any>this.myForm).controls.obdobjeObiskov;
      const intervalCtrl = obdobjeCtrl.controls.interval;
      const zadnjiDatumCtrl = obdobjeCtrl.controls.koncniDatum;

      const change$ = obdobjeCtrl.controls.type.valueChanges;

      change$.subscribe((tip:any) => {
        if (tip === 'vmesniDnevi') {
          intervalCtrl.setValidators([Validators.required, Validators.pattern(/^[1-9]\d*$/)]);
          zadnjiDatumCtrl.setValidators(null);
        } else {
          intervalCtrl.setValidators(null);
          zadnjiDatumCtrl.setValidators(Validators.required);
        }
        intervalCtrl.updateValueAndValidity();
        zadnjiDatumCtrl.updateValueAndValidity();
      });
    }


    /**
    * Zahteva veljaven koncni datum ali veljaven interval med obiski
    */
    initObdobjeObiskovGroup() {
      // Ker je interval po default naj koncniDatum ne bo obvezen
      const group = this._fb.group({
        type: ['vmesniDnevi'],
        interval: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
        koncniDatum: ['']
      });

      return group;
    }

    /**
    * Ce rabi material vrne true (vrsta obiska)
    */
    aliRabiMaterial() {
      if (this.myForm.controls.vrstaObiska.value.id == 5)
        return true;
      else
        return false;
    }

    /**
    * Ce rabi zdravila vrne true (glede na vrsto obiska)
    */
    aliRabiZdravilo() {
      if (this.myForm.controls.vrstaObiska.value.id == 4)
        return true;
      else
        return false;
    }

    /**
    * Izracuna minimalen datum za koncen datum obiskov
    */
    izracunajMinimalenDatum() {
      let izbranNacinChanges = (<any>this.myForm).controls.obdobjeObiskov.controls.type.valueChanges;

      izbranNacinChanges.subscribe((nacin: any) => {
        if (nacin === 'zadnjiDan') {
          this.minDateKoncen = new Date(this.myForm.controls.prviDatum.value);
          this.addWorkDays(this.minDateKoncen, this.myForm.controls.steviloObiskov.value-1);
        }
      });
    }

    /**
    * Dodaj delovne dni k datumu (TODO upostevaj praznike)
    */
    addWorkDays(startDate: Date, days: number) {
      // Get the day of the week as a number (0 = Sunday, 1 = Monday, .... 6 = Saturday)
      var dow = startDate.getDay();
      var daysToAdd = days;
      // If the current day is Sunday add one day
      if (dow == 0)
      daysToAdd++;
      // If the start date plus the additional days falls on or after the closest Saturday calculate weekends
      if (dow + daysToAdd >= 6) {
        //Subtract days in current working week from work days
        var remainingWorkDays = daysToAdd - (5 - dow);
        //Add current working week's weekend
        daysToAdd += 2;
        if (remainingWorkDays > 5) {
          //Add two days for each working week by calculating how many weeks are included
          daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
          //Exclude final weekend if remainingWorkDays resolves to an exact number of weeks
          if (remainingWorkDays % 5 == 0)
          daysToAdd -= 2;
        }
      }
      startDate.setDate(startDate.getDate() + daysToAdd);
      return startDate;
    }


    /**
    * Inicializira zdravila (da jih lahko dodas vec)
    */
    initZdravila() {
      return this._fb.group({
        zdravilo: ['']
      });
    }

    /**
    * Inicializira material (da jih lahko dodas vec v obrazcu)
    */
    initMaterial() {
      return this._fb.group({
        material: [''],
        kolicina: ['']
      });
    }

    /**
    * Preberi podatke o pacientu
    */
    pridobiPodatke() {
      this.problemPridobivanja = false;
      this.pacient = '';

      if (!this.pacient.stevilkaPacienta) {
        this.neveljavnaStevilka = true;
      } else {
        this.neveljavnaStevilka = false;
        this.pacientInfoService.get(this.pacient.stevilkaPacienta)
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

    /**
    * Pridobi seznam vrste obiskov iz backenda
    */
    dobiVrsteObiskov() {
      this.problemPridobivanja = false;
      this.delovniNalogService.getVrsteObiskov()
      .subscribe(
        response => {
          if (JSON.parse(localStorage.getItem('currentUser')).tipUporabnika === 'vodja PS') {
            this.vrsteObiskov = [];
            var that = this;
            (response as any).results.forEach(function(entry:any) {
              if (entry.id < 4)
                that.vrsteObiskov.push(entry);
            });
          } else {
            this.vrsteObiskov = (response as any).results;
          }

        },
        error => {
          this.problemPridobivanja = true;
        }
      );
    }

    reset() {
      this.myForm.reset();

    }

    /**
    * Prikaze HTML element za izbiranje izmed materialov/zdravil
    * @return boolean ali rabi vrsta obiska material
    */
    prikaziMaterial(): boolean {
      if (this.myForm.controls.vrstaObiska.value && this.myForm.controls.vrstaObiska.value.material) {
        return true;
      } else {
        return false;
      }
    }


    /**
    * Dodaj dropdown seznam za zdravilo, ki ga je treba injicirati
    */
    dodajZdravilo() {
      const control = <FormArray>this.myForm.controls['zdravila'];
      control.push(this.initZdravila());
    }

    odstraniZdravilo(i: number) {
      const control = <FormArray>this.myForm.controls['zdravila'];
      control.removeAt(i);
    }

    /**
    * Dodaj polje za izbiro epruvete
    */
    dodajMaterial() {
      const control = <FormArray>this.myForm.controls['materiali'];
      control.push(this.initMaterial());
    }

    odstraniMaterial(i: number) {
      const control = <FormArray>this.myForm.controls['materiali'];
      control.removeAt(i);
    }

    /**
    * Pridobi seznam zdravil
    */
    pridobiZdravila() {
      this.problemPridobivanja = false;
      this.delovniNalogService.getZdravila()
      .subscribe(
        response => {
          this.zdravila = response;
        },
        error => {
          this.problemPridobivanja = true;
        }
      );
    }

    /**
    * Pridobi razne epruvete, ki so na voljo
    */
    pridobiEpruvete() {
      this.problemPridobivanja = false;
      this.delovniNalogService.getEpruvete()
      .subscribe(
        response => {
          this.epruvete = response;
        },
        error => {
          this.problemPridobivanja = true;
        }
      );
    }

  }
