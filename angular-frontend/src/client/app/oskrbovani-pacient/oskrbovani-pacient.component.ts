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
  public prikaziKontakt : boolean;

  public sifreOkolisa: any;
  public problemPridobivanja: boolean;

  constructor(private fb: FormBuilder, private pacientService: PacientService) {}

ngOnInit() {
  this.dobiSifre();
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
    spol: ['', Validators.required],
    geslo1: ['', Validators.required],
    geslo2: ['', Validators.required],
    kontaktIme: ['', Validators.required],
    kontaktPriimek: ['', Validators.required],
    kontaktTelefon: ['', Validators.required],
    kontaktSorodstvo: ['', Validators.required],
    kontaktNaslov: ['', Validators.required]
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
  bdate.setFullYear(bdate.getFullYear() - 18);
  this.minDate = new Date(bdate);
}

  pacient: Pacient;

  registriraj(podatki: any) {
    // pobrisi podatke kontakta
    if (!this.prikaziKontakt) {
      podatki.kontaktIme = "";
      podatki.kontaktPriimek = "";
      podatki.kontaktNaslov = "";
      podatki.kontaktTelefon = "";
      podatki.kontaktSorodstvo = "";
    }

    this.pacient = new Pacient(podatki.ime, podatki.priimek, podatki.email, podatki.geslo1, podatki.tel, parseInt(podatki.zavarovanje), podatki.ulica, podatki.hisnast, podatki.kraj, podatki.datumRojstva, podatki.spol, podatki.sifraOkolisa, podatki.kontaktIme, podatki.kontaktPriimek, podatki.kontaktTelefon, podatki.kontaktNaslov, podatki.kontaktSorodstvo);

    console.log(JSON.stringify(this.pacient));

    this.pacientService.ustvari(this.pacient)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
        }
      )

    // todo REST implementacija
  }

  dodajKontakt() {
    this.prikaziKontakt = true;
  }
  odstraniKontakt() {
    this.prikaziKontakt = false;
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

}
