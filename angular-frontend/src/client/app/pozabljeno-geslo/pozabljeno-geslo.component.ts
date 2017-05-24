import { Component, OnInit } from '@angular/core';
import { UporabnikService } from '../shared/services/index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'pozabljeno-geslo',
  templateUrl: 'pozabljeno-geslo.component.html',
  styleUrls: ['pozabljeno-geslo.component.css']
})
export class PozabljenoGesloComponent implements OnInit {
  public bap : any;
  public prikaziNapako : boolean;
  public prikaziPregled : boolean;

  public sForm: FormGroup;

  constructor(private fb: FormBuilder, private uporabnikService: UporabnikService, private router: Router) {}

  ngOnInit() {
	
    this.prikaziNapako = false;
    this.prikaziPregled = false;

    // on init
    this.sForm = this.fb.group({
      email: ['', Validators.required],
      geslo1: ['', Validators.required],
      geslo2: ['', Validators.required],
    });
  }
  
  spremeni(podatki: any) {
    this.bap = {"priimek" : podatki.geslo1, "ime" : podatki.email};
    this.uporabnikService.pozabljenoGeslo(this.bap).subscribe(
      response => {
        this.prikaziPregled = true;
      },
      error => {
        this.prikaziNapako = true;
      }
    );
  }
  
  redirect() {
    this.router.navigateByUrl('/prijava');
  }

}
