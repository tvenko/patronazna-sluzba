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
    tel: ['', Validators.required],
    sifra1: ['', Validators.required],
    sifra2: ['', Validators.required],
    email: ['', Validators.required],
    geslo1: ['', Validators.required],
    geslo2: ['', Validators.required]
  });

}

  delavec: Delavec;

  registriraj(podatki: any) {
    //this.delavec = new Delavec(podatki.ime, podatki.priimek, podatki.tel,  podatki.sifra1, podatki.sifra2, podatki.email, podatki.geslo1, podatki.geslo2);
    //console.log(podatki);

    // todo REST implementacija
    var url = "http://fruity-routy.ddns.net:3030/api/v1/racuni/delavci/";
    var client = new XMLHttpRequest();
    client.open("GET", url, true);
    client.send();
    console.log(client.status);
    console.log(client.statusText);

  }

}