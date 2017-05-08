import { Component } from '@angular/core';
import {Router} from '@angular/router';
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
  public uspesnoRegistriran: boolean = false;

  public poste: any;
  public sifreOkolisa: any;
  public sorodstvenaRazmerja: any;
  public problemPridobivanja: boolean;
  public prikaziPregled: boolean;
  public prikaziNapako: boolean;
  public loading: any;

  constructor(private fb: FormBuilder,
              private pacientService: PacientService,
              private router: Router) {}

ngOnInit() {
  this.dobiSifre();
  this.dobiPoste();
  this.dobiSorodstvenaRazmerja();
  this.prikaziPregled = false;
  this.prikaziKontakt = false;
  this.loading = false;
  this.regForm = this.fb.group({
    zavarovanje: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
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
    kontaktnaOseba: this.fb.group({
      ime: [''],
      priimek: [''],
      tel: [''],
      sorodstveno_razmerje: [''],
      ulica: [''],
      hisna_stevilka: [''],
      posta: ['']
    }),
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
    this.uspesnoRegistriran = false;
    this.loading = true;
    // this.regForm.reset();
    // dodaj da dela samo ko je registrcija ok
    if (!this.prikaziKontakt) {

      this.pacient = new Pacient(podatki.ime, podatki.priimek, podatki.email, podatki.geslo1,
        podatki.tel, parseInt(podatki.zavarovanje), podatki.ulica, podatki.hisnast,
        podatki.kraj, this.vString(podatki.datumRojstva), podatki.spol, podatki.sifreOkolisa.id);
    } else {

      this.pacient = new Pacient(podatki.ime, podatki.priimek, podatki.email, podatki.geslo1,
        podatki.tel, parseInt(podatki.zavarovanje), podatki.ulica, podatki.hisnast,
        podatki.kraj, this.vString(podatki.datumRojstva), podatki.spol, podatki.sifreOkolisa.id,
        /*podatki.kontaktIme, podatki.kontaktPriimek, podatki.kontaktTelefon, podatki.kontaktNaslov,
        podatki.kontaktSorodstvo,*/ podatki.kontaktnaOseba);
    }

    this.pacientService.ustvari(this.pacient)
      .subscribe(
        response => {
          //console.log(response);
          this.uspesnoRegistriran = true;
          this.prikaziPregled = true;
          this.loading = false;
        },
        error => {
          // filtriraj glede na razlicne napake
          this.uspesnoRegistriran = false;
          this.prikaziNapako = true;
          this.loading = false;
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

  redirect() {
    this.router.navigateByUrl('/prijava');
  }

  dobiSorodstvenaRazmerja() {
      this.pacientService.getSorodnike()
        .subscribe(
          response => {
            this.sorodstvenaRazmerja = response;
          },
          error => {
            console.log("Ni mi uspelo pridobiti sorodstvenih razmerij.")
          }
        )
  }

  preveriKontaktnoOsebo(checked: any) {
    const kontaktCtrl =  (<any>this.regForm).controls.kontaktnaOseba;
    if (checked) {
      kontaktCtrl.controls.ime.setValidators(Validators.required);
      kontaktCtrl.controls.priimek.setValidators(Validators.required);
      kontaktCtrl.controls.tel.setValidators(Validators.required);
      kontaktCtrl.controls.ulica.setValidators(Validators.required);
      kontaktCtrl.controls.hisna_stevilka.setValidators(Validators.required);
      kontaktCtrl.controls.posta.setValidators(Validators.required);
      kontaktCtrl.controls.sorodstveno_razmerje.setValidators(Validators.required);
      kontaktCtrl.controls.ime.updateValueAndValidity();
      kontaktCtrl.controls.priimek.updateValueAndValidity();
      kontaktCtrl.controls.tel.updateValueAndValidity();
      kontaktCtrl.controls.ulica.updateValueAndValidity();
      kontaktCtrl.controls.hisna_stevilka.updateValueAndValidity();
      kontaktCtrl.controls.posta.updateValueAndValidity();
      kontaktCtrl.controls.sorodstveno_razmerje.updateValueAndValidity();
    } else {
      kontaktCtrl.controls.ime.setValidators(null);
      kontaktCtrl.controls.priimek.setValidators(null);
      kontaktCtrl.controls.tel.setValidators(null);
      kontaktCtrl.controls.ulica.setValidators(null);
      kontaktCtrl.controls.hisna_stevilka.setValidators(null);
      kontaktCtrl.controls.posta.setValidators(null);
      kontaktCtrl.controls.sorodstveno_razmerje.setValidators(null);
      kontaktCtrl.controls.ime.updateValueAndValidity();
      kontaktCtrl.controls.priimek.updateValueAndValidity();
      kontaktCtrl.controls.tel.updateValueAndValidity();
      kontaktCtrl.controls.ulica.updateValueAndValidity();
      kontaktCtrl.controls.hisna_stevilka.updateValueAndValidity();
      kontaktCtrl.controls.posta.updateValueAndValidity();
      kontaktCtrl.controls.sorodstveno_razmerje.updateValueAndValidity();
    }
  }

}
