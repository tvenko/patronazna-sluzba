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
  public vrstaDelavca: any[];
  //public vrstaDelavca: any;
  public sifreOkolisa: any;
  public problemPridobivanja: boolean;

  constructor(private fb: FormBuilder, private delavecService: DelavecService,) {
    this.vrstaDelavca=["zdravnik", "vodja patronažne službe", "medicinska sestra", "uslužbenec"];
  }

ngOnInit() {
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
    sifreOkolisa: ['', Validators.required],
  });

}

  delavec: Delavec;

  registriraj(podatki: any) {
    /* uporabnik, ime, priimek, vrsta delavca, naziv vrste, tel, osebna sifra, sifra ustanove, naziv ustanove, email, pass, sifra okolisa, naziv okolisa */
    this.delavec = new Delavec("9", podatki.ime, podatki.priimek, podatki.vrstaDelavca, podatki.vrstaDelavca, podatki.tel,  podatki.sifra1, podatki.sifra2, "bla", podatki.email, podatki.geslo1, podatki.sifreOkolisa.id, podatki.sifreOkolisa.naziv);
    console.log(JSON.stringify(this.delavec));

    this.delavecService.ustvari(this.delavec)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
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
    return ((this.regForm.controls.vrstaDelavca.value === "medicinska sestra") ? true : false);
  }

}
