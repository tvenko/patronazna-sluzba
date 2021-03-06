import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Delavec } from './delavec';
import { DelavecService } from '../shared/services/index';

@Component({
  moduleId: module.id,
  selector: 'reg',
  templateUrl: 'reg.html',
  styleUrls: ['reg.component.css']
})
export class RegComponent {
  public regForm: FormGroup;
  public vrstaDelavca: any;
  public nazivUstanove: any;
  public sifreOkolisa: any;
  public problemPridobivanja: boolean;
  public prikaziPregled: boolean;
  public prikaziNapako: boolean;

  constructor(private fb: FormBuilder, private delavecService: DelavecService,) {
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
  this.prikaziPregled = false;
  this.prikaziNapako = false;
  this.dobiSifre();
  //this.dobiVrste();
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

  delavec: Delavec;

  registriraj(podatki: any) {
    console.log(this.sifreOkolisa);
    if (podatki.sifreOkolisa.naziv) {
      this.delavec = new Delavec(podatki.ime, podatki.priimek, podatki.email, podatki.tel, podatki.geslo1, parseInt(podatki.sifra1), podatki.vrstaDelavca, podatki.sifra2, podatki.sifreOkolisa.naziv);
    } else {
      this.delavec = new Delavec(podatki.ime, podatki.priimek, podatki.email, podatki.tel, podatki.geslo1, parseInt(podatki.sifra1), podatki.vrstaDelavca, podatki.sifra2, "Ljubljana vič");
    }
    console.log(JSON.stringify(this.delavec));

    this.delavecService.ustvari(this.delavec)
      .subscribe(
        response => {
          console.log(response);
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
