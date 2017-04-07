import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Delavec } from './delavec';

@Component({
  moduleId: module.id,
  selector: 'reg',
  templateUrl: 'reg.html'
})
export class RegComponent {
  public regForm: FormGroup;
  public events: any[] = [];

  constructor(private fb: FormBuilder) {}

ngOnInit() {

  this.regForm = this.fb.group({
    ime: ['', Validators.required],
    priimek: ['', Validators.required],
    sifra1: ['', Validators.required],
    sifra2: ['', Validators.required],
    email: ['', Validators.required],
    geslo1: ['', Validators.required],
    geslo2: ['', Validators.required]
  });

}



  //delavci: Delavec[] = [];
  //delavec: Delavec;

  registriraj(podatki: any) {
    //this.delavec = new Delavec(podatki.sifra1, podatki.ime, podatki.priimek, podatki.email, podatki.geslo, podatki.confirm);
    //if (podatki) this.delavci.push(this.delavec);
    console.log(podatki);
  }

}
