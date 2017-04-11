import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Pacient } from './pacient';

@Component({
  moduleId: module.id,
  selector: 'reg-pacient',
  templateUrl: 'reg-pacient.html',
  styleUrls: ['reg-pacient.component.css']
})
export class RegPacientComponent {
  public regForm: FormGroup;
  public date: Date;
  public minDate: Date;
  public si: any;

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

  this.si = {
          firstDayOfWeek: 0,
          dayNames: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"],
          dayNamesShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
          dayNamesMin: ["Ne","Po","To","Sr","Če","Pe","So"],
          monthNames: [ "Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December" ],
          monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Maj", "Jun","Jul", "Avg", "Sep", "Okt", "Nov", "Dec" ]
  };

  let bdate = new Date();
  bdate.setFullYear(bdate.getFullYear() - 18);
  this.minDate = new Date(bdate);
}

  pacient: Pacient;

  registriraj(podatki: any) {
    //this.pacient = new Delavec(podatki.ime, podatki.priimek, podatki.tel,  podatki.sifra1, podatki.sifra2, podatki.email, podatki.geslo1, podatki.geslo2);
    //this.pacient = new Pacient(podatki.ime, podatki.priimek, podatki.vrstaDelavca, podatki.tel,  podatki.sifra1, podatki.sifra2, podatki.email, podatki.geslo1, podatki.sifraOkolisa);
    //console.log(this.pacient);
    console.log(JSON.stringify(podatki));

    // todo REST implementacija
  }

}
