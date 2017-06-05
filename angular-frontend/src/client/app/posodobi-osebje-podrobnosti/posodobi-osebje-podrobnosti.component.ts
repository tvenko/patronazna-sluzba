import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Delavec } from './delavec';
import { DelavecService } from '../shared/services/index';

import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'posodobi-osebje-podrobnosti',
  templateUrl: 'posodobi-osebje-podrobnosti.component.html',
  styleUrls: ['posodobi-osebje-podrobnosti.component.css']
})
export class PosodobiOsebjePodrobnostiComponent {
  public regForm: FormGroup;
  public vrstaDelavca: any;
  public nazivUstanove: any;
  public sifreOkolisa: any;
  public problemPridobivanja: boolean;
  public prikaziPregled: boolean;
  public prikaziNapako: boolean;
  
  public osebnaSifra: any;
  public izbranDelavec: any;
  public delavecNajden: boolean;

  constructor(private fb: FormBuilder, private delavecService: DelavecService, private activatedRoute: ActivatedRoute) {
    this.vrstaDelavca=["zdravnik", "vodja PS", "patronažna sestra", "delavec ZD"];
    this.nazivUstanove=["ZD Medvode",
    "UKC Ljubljanapediatrična klinika",
    "Zdravstveni dom Domžale",
    "Zdravstveni dom Maribor",
    "Bolnišnica Ptuj",
    "Zdravstveni dom Vič-Rudnik",
    "Zdravstveni dom Ljubljana-šentvid",
    "Zdravstveni dom center",
    "Splošna bolnišnica Celje",
    "ZD Slov. Konjice"];
  }

ngOnInit() {
  
  this.delavecNajden = false;
  
  this.activatedRoute.params.subscribe((params: Params) => {
	let osebnaSifra = params['osebnaSifra'];
	this.osebnaSifra = osebnaSifra;
	this.pridobiPodatke()
  });
  
  this.prikaziPregled = false;
  this.prikaziNapako = false;
  this.regForm = this.fb.group({
    ime: ['', Validators.required],
    priimek: ['', Validators.required],
    vrstaDelavca: ['', Validators.required],
    tel: ['', Validators.required],
    sifra1: ['', Validators.required],
    sifra2: ['', Validators.required],
    email: ['', Validators.required],
    geslo1: ['', Validators.required],
    geslo2: ['', Validators.required],
    sifreOkolisa: [''],
  });

}

	pridobiPodatke() {
	  this.delavecService.getBySifraUsluzbenca(this.osebnaSifra)
	  .subscribe(
		response => {
		  this.izbranDelavec = response;
		  console.log(this.izbranDelavec);
		  this.dobiSifre();
		  this.delavecNajden = true;
		},
		error => {
		  console.log("error");
		}
	  )
	}

  delavec: Delavec;

  registriraj(podatki: any) {
    console.log(this.sifreOkolisa);
    if (podatki.sifreOkolisa.naziv) {
      this.delavec = new Delavec(podatki.ime, podatki.priimek, podatki.email, podatki.tel, podatki.geslo1, parseInt(podatki.sifra1), podatki.vrstaDelavca, podatki.sifra2, podatki.sifreOkolisa.naziv);
    } else {
      this.delavec = new Delavec(podatki.ime, podatki.priimek, podatki.email, podatki.tel, podatki.geslo1, parseInt(podatki.sifra1), podatki.vrstaDelavca, podatki.sifra2, "Ljubljana vič");
    }
    console.log(JSON.stringify(this.delavec));

    this.delavecService.posodobi(this.delavec)
      .subscribe(
        response => {
          this.prikaziPregled = true;
        },
        error => {
          this.prikaziNapako = true;
        }
      )
  }

  dobiSifre() {
    this.problemPridobivanja = false;
    this.delavecService.getSifreOkolisa()
    .subscribe(
      response => {
        this.sifreOkolisa = response;
		var indeks = 0;
		for (var i=this.sifreOkolisa.results.length-1; i>=0; i--) {
			if (this.sifreOkolisa.results[i].naziv == this.izbranDelavec.naziv_okolisa) {
				indeks = i;
				break;
			}
		}
		var sifraOkolisa = {id:1, naziv: this.izbranDelavec.naziv_okolisa};
		this.regForm = this.fb.group({
			ime: [this.izbranDelavec.ime, Validators.required],
			priimek: [this.izbranDelavec.priimek, Validators.required],
			vrstaDelavca: [this.izbranDelavec.naziv_delavca, Validators.required],
			tel: [this.izbranDelavec.tel, Validators.required],
			sifra1: [this.izbranDelavec.osebna_sifra, Validators.required],
			sifra2: [this.izbranDelavec.naziv_ustanove, Validators.required],
			email: [this.izbranDelavec.email, Validators.required],
			geslo1: [''],
			geslo2: [''],
			sifreOkolisa: [this.sifreOkolisa.results[indeks]],
		 });
      },
      error => {
        this.problemPridobivanja = true;
      }
    );
  }

  dobiVrste() {
    this.problemPridobivanja = false;
    this.delavecService.getVrsteDelavcev()
    .subscribe(
      response => {
        this.vrstaDelavca = response;
      },
      error => {
        this.problemPridobivanja = true;
      }
    );
  }

  rabiSifroOkolisa() {
    return ((this.regForm.controls.vrstaDelavca.value === "patronažna sestra") ? true : false);
  }

}
