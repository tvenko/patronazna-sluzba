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

  public sForm: FormGroup;

  constructor(public pacientService: PacientService, private fb: FormBuilder) {}

  ngOnInit() {
    this.pacient = JSON.parse(localStorage.getItem('podatkiPacienta'));
    if (!this.pacient) {
      this.pacient = {};
    }
    this.uporabnik = JSON.parse(localStorage.getItem('currentUser'));
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
  }

  spremeni(podatki: any) {
    console.log(this.uporabnik);
    this.bap = {"novoGeslo" : podatki.geslo1, "staroGeslo" : podatki.trenutno};
    console.log(this.bap);
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
