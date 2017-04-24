import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Pacient } from './pacient';
import { PacientService } from '../shared/services/index';

@Component({
  moduleId: module.id,
  selector: 'oskrbovani-pacient',
  templateUrl: 'oskrbovani-pacient.html',
  styleUrls: ['oskrbovani-pacient.component.css']
})
export class OskrbovaniPacientComponent {
  public regForm: FormGroup;
  public si: any;

  public trenutniPacient: any;
  public prikaziPregled: boolean;

  public sifreOkolisa: any;
  public problemPridobivanja: boolean;

  public date: Date;
  public minDate: Date;

  constructor(private fb: FormBuilder, private pacientService: PacientService) {}

ngOnInit() {
  this.prikaziPregled = false;
  this.trenutniPacient = JSON.parse(localStorage.getItem('podatkiPacienta')).stevilkaPacienta;
  this.dobiSifre();
  this.regForm = this.fb.group({
    zavarovanje: ['', Validators.required],
    ime: ['', Validators.required],
    priimek: ['', Validators.required],
    datumRojstva: [''],
    spol: ['', Validators.required],
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
    this.prikaziPregled = true;
    this.pacient = new Pacient(podatki.ime, podatki.priimek, parseInt(podatki.zavarovanje), this.vString(podatki.datumRojstva), podatki.spol, this.trenutniPacient);


    this.pacientService.ustvariVezanega(this.pacient)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
        }
      )
      this.regForm.reset();
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
