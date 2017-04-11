import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Delavec } from './delavec';

@Component({
  moduleId: module.id,
  selector: 'reg',
  templateUrl: 'reg.html',
  styleUrls: ['reg.component.css']
})
export class RegComponent {
  public regForm: FormGroup;
  public vrstaDelavca: any[];

  constructor(private fb: FormBuilder) {
    this.vrstaDelavca=["zdravnik", "vodja patronažne službe", "medicinska sestra", "uslužbenec"];
  }

ngOnInit() {

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
    sifraOkolisa: ['', Validators.required]
  });

}

  delavec: Delavec;

  registriraj(podatki: any) {
    this.delavec = new Delavec(podatki.ime, podatki.priimek, podatki.vrstaDelavca, podatki.tel,  podatki.sifra1, podatki.sifra2, podatki.email, podatki.geslo1, podatki.sifraOkolisa);
    console.log(JSON.stringify(this.delavec));

    


  }

  rabiSifroOkolisa() {  return ((this.regForm.controls.vrstaDelavca._value === "medicinska sestra") ? true : false); }

}
