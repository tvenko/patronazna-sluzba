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

  constructor(private pacientInfoService: PacientService,
    private delovniNalogService: DelovniNalogService,
    private _fb: FormBuilder) {
    }

    ngOnInit() {
      this.dobiVrsteObiskov();
      this.pridobiZdravila();
      this.pridobiEpruvete();


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
        stevilkaPacienta: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
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

    }


    pregled() {
      console.log(JSON.stringify(this.myForm.value));
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
    * @return boolean ali zeli vnesti koncen datum in ne interval
    */
    izracunajMinimalenDatum() {
      let izbranNacin = (<any>this.myForm).controls.obdobjeObiskov.controls.type.value;

      if (!izbranNacin || izbranNacin == 'vmesniDnevi') {
        return false;
      } else {
        this.minDateKoncen = new Date(this.myForm.controls.prviDatum.value);
        this.addWorkDays(this.minDateKoncen, this.myForm.controls.steviloObiskov.value-1);
        return true;
      }
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
        naziv: [''],
        sifra: ['']
      });
    }

    /**
    * Inicializira material (da jih lahko dodas vec v obrazcu)
    */
    initMaterial() {
      return this._fb.group({
        opis: [''],
        id: [''],
        kolicina: ['']
      });
    }

    /**
    * Preberi podatke o pacientu
    */
    pridobiPodatke() {
      this.problemPridobivanja = false;

      if (!this.myForm.controls.stevilkaPacienta.value) {
        this.neveljavnaStevilka = true;
      } else {
        this.neveljavnaStevilka = false;
        this.pacientInfoService.get(this.myForm.controls.stevilkaPacienta.value)
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
          this.vrsteObiskov = response;
        },
        error => {
          this.problemPridobivanja = true;
        }
      );
    }

    /**
    * Prikaze HTML element za izbiranje izmed materialov/zdravil
    * @return boolean ali rabi vrsta obiska material
    */
    prikaziMaterial(): boolean {
      if (this.myForm.controls.vrstaObiska.value.material) {
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
