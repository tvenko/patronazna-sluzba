import { Component, OnInit } from '@angular/core';
import { PacientService } from '../shared/services/index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

/**
* This class represents the lazy loaded DelovniNalogComponent.
*/
@Component({
  moduleId: module.id,
  selector: 'sd-sprememba-podatkov',
  templateUrl: 'sprememba-podatkov.component.html',
  styleUrls: ['sprememba-podatkov.component.css']
})
export class SpremembaPodatkovComponent implements OnInit {
  public pacient: any;
  public uporabnik: any;
  public bap : any;
  public prikaziNapako : boolean;
  public prikaziPregled : boolean;
  public si: any;
  public poste: any;
  public sifreOkolisa: any;
  public sorodstvenaRazmerja: any;
  public problemPridobivanja: boolean;
  public jePacient: boolean;

  trenutniPodatki: any;

  public sForm: FormGroup;
  public pForm: FormGroup;

  constructor(public pacientService: PacientService, private fb: FormBuilder) {}

  ngOnInit() {
	this.jePacient = true;
	this.uporabnik = JSON.parse(localStorage.getItem('currentUser'));
	if (this.uporabnik.tipUporabnika != 'pacient') {
		this.jePacient = false;
	}
	this.pacient = JSON.parse(localStorage.getItem('podatkiPacienta'));
	if (!this.pacient) {
	  this.pacient = {};
	}
	if (!this.uporabnik)
	  this.uporabnik = {};

	  this.prikaziNapako = false;
	  this.prikaziPregled = false;

	// on init
	this.sForm = this.fb.group({
	  trenutno: ['', Validators.required],
	  geslo1: ['', Validators.required],
	  geslo2: ['', Validators.required],
	});
	this.pForm = this.fb.group({
	  datumRojstva: [''],
	  kraj: [''],
	  hisnaStevilka: [''],
	  ulica: [''],
	  eposta: [''],
	  ime: [''],
	  priimek: [''],
	  telefon: [''],
	  stevilkaPacienta: ['']
	});
	this.getPacient();
	this.dobiSifre();
	this.dobiPoste();
    this.si = {
            firstDayOfWeek: 0,
            dayNames: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"],
            dayNamesShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
            dayNamesMin: ["Ne","Po","To","Sr","Če","Pe","So"],
            monthNames: [ "Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December" ],
            monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Maj", "Jun","Jul", "Avg", "Sep", "Okt", "Nov", "Dec" ]
    };
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

  getPacient() {
    //console.log(this.uporabnik);
    this.pacientService.get(this.pacient.stevilkaPacienta).subscribe(
      response => {
        this.trenutniPodatki = response;
        this.trenutniPodatki.datumRojstva = new Date(this.trenutniPodatki.datumRojstva);
        this.pForm.patchValue(response);
      },error => {});
  }

  spremeniPodatke(podatki: any) {
    podatki.datumRojstva = podatki.datumRojstva.toISOString().substr(0, 10);
    //console.log(podatki);
    //console.log(JSON.stringify(podatki).replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g, '$1"$3":'));
    podatki = JSON.stringify(podatki).replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g, '$1"$3":');
    console.log(podatki);
    this.pacientService.spremeniPodatke(this.pacient.stevilkaPacienta, podatki).subscribe(
      response => {
        console.log("success");
      },error => {
        console.log("error");
      });
  }

  spremeni(podatki: any) {
    //console.log(this.uporabnik);
    this.bap = {"novoGeslo" : podatki.geslo1, "staroGeslo" : podatki.trenutno};
    //console.log(this.bap);
    this.pacientService.putGeslo(this.uporabnik.id, this.bap).subscribe(
      response => {
        console.log(response);
        this.prikaziPregled = true;
      },
      error => {
        this.prikaziNapako = true;
      }
    );
  }
}
