import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Pacient } from './pacient';

@Component({
  moduleId: module.id,
  selector: 'reg-pacient',
  templateUrl: 'reg-pacient.html'
})
export class RegPacientComponent {
  public regForm: FormGroup;
  public events: any[] = [];

  constructor(private fb: FormBuilder) {}

ngOnInit() {

  this.regForm = this.fb.group({
    zavarovanje: ['', Validators.required],
    ime: ['', Validators.required],
    priimek: ['', Validators.required],
    naslov: ['', Validators.required],
    sifraOkolisa: ['', Validators.required],
    tel: ['', Validators.required],
    email: ['', Validators.required],
    datumRojstva: ['', Validators.required],
    spol: ['', Validators.required],
    geslo1: ['', Validators.required],
    geslo2: ['', Validators.required]
  });

}

  pacient: Pacient;

  registriraj(podatki: any) {
    //this.pacient = new Delavec(podatki.ime, podatki.priimek, podatki.tel,  podatki.sifra1, podatki.sifra2, podatki.email, podatki.geslo1, podatki.geslo2);
    console.log(podatki);

    // todo REST implementacija
  }

}
