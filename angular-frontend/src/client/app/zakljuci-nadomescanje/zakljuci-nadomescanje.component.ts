import { Component, OnInit } from '@angular/core';
import { Pacient, Zdravilo, DelovniNalog, Material } from '../shared/models/index';
import { DelavecService } from '../shared/services/index';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'sd-nadomescanje-zakljuci',
  templateUrl: 'zakljuci-nadomescanje.component.html',
  styleUrls: ['zakljuci-nadomescanje.component.css']
})
export class ZakljuciNadomescanjeComponent implements OnInit {

  public vrnjeneSestre: any = [];
  public formSestra: FormGroup;
  public error: any;
  public response: any;


  constructor(private delavecService: DelavecService,
              private _fb: FormBuilder) {}

  ngOnInit() {
    this.formSestra = this._fb.group({
      patronazna_sestra: ['', Validators.required],
    });

    this.delavecService.getVrnjeneMS().subscribe(
      response => {
        this.vrnjeneSestre = response;
      }, error => {
        this.error = error;
      }
    );
  }

  poslji(value: any) {
    this.delavecService.zakljuciNadomescanje(value.patronazna_sestra.uporabnik).subscribe(
      response => {
        //console.log(response);
        //var i = this.vrnjeneSestre.indexOf(value.patronazna_sestra);
        //this.vrnjeneSestre.splice(i, 1);
        this.response = response.message + '(' + response.obiski + ')';
      }, error => {
        this.error = error._body;
      }
    );
  }
}
