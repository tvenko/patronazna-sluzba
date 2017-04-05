import { Component, OnInit } from '@angular/core';
import { VrstaObiska, Pacient, Zdravilo } from '../shared/models/index';
import { PacientService, DelovniNalogService } from '../shared/services/index';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

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
  public izbranaVrsta = new VrstaObiska;
  public pacient = new Pacient;
  public zdravila: Zdravilo[];
  public vrsteObiskov: any[];
  public stevilkaPacienta: string;
  public problemPridobivanja: boolean;
  public neveljavnaStevilka: boolean;
  public epruvete: any[];
  public myForm: FormGroup;
  public date: Date;
  public minDate: Date;
  public si: any;

  constructor(private pacientInfoService: PacientService,
              private delovniNalogService: DelovniNalogService,
              private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.stevilkaPacienta = undefined;
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
      prviDatum: [''],
      zadnjiDatum: [''],
      interval: [''],
      steviloObiskov: [''],
      obvezen: ['']
    });

    // Lokalizacija za izbiro datuma
    this.si = {
            firstDayOfWeek: 0,
            dayNames: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"],
            dayNamesShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
            dayNamesMin: ["Ne","Po","To","Sr","Če","Pe","So"],
            monthNames: [ "Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December" ],
            monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Maj", "Jun","Jul", "Avg", "Sep", "Okt", "Nov", "Dec" ]
    };

    // Minimalen datum za izbiro obiska
    let today = new Date();
    this.minDate = new Date(today);
  }

  /**
   * Inicializira zdravila (da jih lahko dodas vec)
   */
  initZdravila() {
    return this._fb.group({
      naziv: ['', [Validators.required]],
      sifra: ['']
    })
  }

  /**
   * Inicializira material (da jih lahko dodas vec v obrazcu)
   */
  initMaterial() {
    return this._fb.group({
      opis: ['', Validators.required],
      id: ['', Validators.required],
      kolicina: ['', Validators.required]
    })
  }

  /**
  * Preberi podatke o pacientu
  */
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
    if (this.izbranaVrsta.material) {
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
