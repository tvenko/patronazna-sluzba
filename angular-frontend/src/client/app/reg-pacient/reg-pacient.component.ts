import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Pacient } from './pacient';
import { PacientService } from '../shared/services/index';

@Component({
  moduleId: module.id,
  selector: 'reg-pacient',
  templateUrl: 'reg-pacient.html',
  styleUrls: ['reg-pacient.component.css']
})
export class RegPacientComponent {
  public regForm: FormGroup;
  public date: Date;
  public minDate: Date;
  public si: any;
  public prikaziKontakt : boolean = false;

  public poste: any;
  public sifreOkolisa: any;
  public problemPridobivanja: boolean;
  public prikaziPregled: boolean;
  public prikaziNapako: boolean;

  constructor(private fb: FormBuilder, private pacientService: PacientService) {}

ngOnInit() {
  this.dobiSifre();
  this.dobiPoste();
  this.prikaziPregled = false;
  this.prikaziKontakt = false;
  this.regForm = this.fb.group({
    zavarovanje: ['', Validators.required],
    ime: ['', Validators.required],
    priimek: ['', Validators.required],
    ulica: ['', Validators.required],
    hisnast: ['', Validators.required],
    kraj: ['', Validators.required],
    sifreOkolisa: ['', Validators.required],
    tel: ['', Validators.required],
    email: ['', Validators.required],
    datumRojstva: ['', Validators.required],
    spol: ['false', Validators.required],
    geslo1: ['', Validators.required],
    geslo2: ['', Validators.required],
    kontaktIme: [''],
    kontaktPriimek: [''],
    kontaktTelefon: [''],
    kontaktSorodstvo: [''],
    kontaktNaslov: ['']
  });

  this.si = {
          firstDayOfWeek: 0,
          dayNames: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"],
          dayNamesShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
          dayNamesMin: ["Ne","Po","To","Sr","Če","Pe","So"],
          monthNames: [ "Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December" ],
          monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Maj", "Jun","Jul", "Avg", "Sep", "Okt", "Nov", "Dec" ]
  };

  let bdate = new Date();
  //bdate.setFullYear(bdate.getFullYear() - 18);
  this.minDate = new Date(bdate);
}

  pacient: Pacient;

  vString(datum: Date) {
    var m = datum.getMonth()+1;
    var d = datum.getDate();
    var y = datum.getFullYear();
    return y+"-"+m+"-"+d;
  }



  registriraj(podatki: any) {
    // this.regForm.reset();
    // dodaj da dela samo ko je registrcija ok
    if (!this.prikaziKontakt) {
      this.pacient = new Pacient(podatki.ime, podatki.priimek, podatki.email, podatki.geslo1, podatki.tel, parseInt(podatki.zavarovanje), podatki.ulica, podatki.hisnast, podatki.kraj, this.vString(podatki.datumRojstva), podatki.spol, podatki.sifreOkolisa.id);
    } else {
      this.pacient = new Pacient(podatki.ime, podatki.priimek, podatki.email, podatki.geslo1, podatki.tel, parseInt(podatki.zavarovanje), podatki.ulica, podatki.hisnast, podatki.kraj, this.vString(podatki.datumRojstva), podatki.spol, podatki.sifreOkolisa.id, podatki.kontaktIme, podatki.kontaktPriimek, podatki.kontaktTelefon, podatki.kontaktNaslov, podatki.kontaktSorodstvo);
    }

    console.log(JSON.stringify(this.pacient));

    this.pacientService.ustvari(this.pacient)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          // filtriraj glede na razlicne napake
          this.prikaziNapako = true;
        }
      )
  }

  dobiSifre() {
    this.problemPridobivanja = false;
    this.pacientService.getSifreOkolisa()
    .subscribe(
      response => {
        this.sifreOkolisa = response;
      },
      error => {
        this.problemPridobivanja = true;
      }
    );
  }

  dobiPoste() {
    this.problemPridobivanja = false;
    this.pacientService.getPoste()
      .subscribe(
        response => {
          this.poste = response;
        },
        error => {
          this.problemPridobivanja = true;
        }
      )
  }

}
