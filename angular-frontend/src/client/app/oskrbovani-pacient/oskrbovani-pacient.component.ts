import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Pacient } from './pacient';
import { PacientService } from '../shared/services/index';

@Component({
  moduleId: module.id,
  selector: 'oskrbovani-pacient',
  templateUrl: 'oskrbovani-pacient.html',
  styleUrls: ['oskrbovani-pacient.component.css']
})
export class OskrbovaniPacientComponent implements OnInit{
  public regForm: FormGroup;
  public si: any;
  public uspesno: any;
  public loading: any;

  public trenutniPacient: any;
  public prikaziPregled: boolean;

  public sifreOkolisa: any;
  public sorodstvenaRazmerja: any;
  public problemPridobivanja: boolean;

  public date: Date;
  public minDate: Date;

  constructor(private fb: FormBuilder, private pacientService: PacientService) {}

ngOnInit() {
  this.prikaziPregled = false;
  this.loading = false;
  this.trenutniPacient = JSON.parse(localStorage.getItem('podatkiPacienta')).stevilkaPacienta;
  this.dobiSifre();
  this.dobiSorodstvenaRazmerja();
  this.regForm = this.fb.group({
    zavarovanje: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    ime: ['', Validators.required],
    priimek: ['', Validators.required],
    datumRojstva: ['', Validators.required],
    spol: ['false', Validators.required],
    sorodstvo: ['', Validators.required]
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
    this.loading = true;
    this.prikaziPregled = true;
    this.pacient = new Pacient(podatki.ime, podatki.priimek, parseInt(podatki.zavarovanje), this.vString(podatki.datumRojstva), podatki.spol, this.trenutniPacient, podatki.sorodstvo);


    this.pacientService.ustvariVezanega(this.pacient)
      .subscribe(
        response => {
          this.uspesno = true;
          this.loading = false;
        },
        error => {
          this.uspesno = false;
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

  dobiSorodstvenaRazmerja() {
    this.pacientService.getSorodnike()
      .subscribe(
        response => {
          this.sorodstvenaRazmerja = response;
        },
        error => {
          console.log("Prislo je do problema pridobivanja sorodstvenaRazmerja")
        }
      )
  }
}
