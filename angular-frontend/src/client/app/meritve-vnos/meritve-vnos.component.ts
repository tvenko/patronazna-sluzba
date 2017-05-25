import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObiskiService } from '../shared/services/obiski/obiski.service';
import { FormControl, NgForm, Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'sd-meritve-vnos',
  templateUrl: 'meritve-vnos.component.html',
  styleUrls: ['meritve-vnos.component.css']
})
export class MeritveVnosComponent implements OnInit, AfterViewChecked {
  id: number;
  obisk: any;
  vezaniPacienti: any;
  meritve: any[] = [];
  test: any;
  uspeh: boolean;
  poslano = false;

  myForm: NgForm;
  @ViewChild('f') currentForm: NgForm;

  constructor(private route: ActivatedRoute, private obiskiService: ObiskiService) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.obiskiService.getById(this.id).subscribe(
      response => {
        this.obisk = response;
        this.obiskiService.getMeritve(this.obisk.vrstaObiskaId).subscribe(
          response => {
            this.meritve = response;
          }
        );
        if(response.vezani_pacienti !== null) {
          for (let id of response.vezani_pacienti) {
            this.pridobiVezanegaPacienta(id);
          }
        }
      }
    );
  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    if (this.currentForm === this.myForm) { return; }
    this.myForm = this.currentForm;
    if (this.myForm) {
      this.myForm.valueChanges.subscribe(
        data => this.onValueChanged(data)
      );
    }
  }

  onValueChanged(data?: any) {
    if(!this.myForm) { return; }
    const form = this.myForm.form;
    for (const key in form.value) {
      if(form.value.hasOwnProperty(key) && form.value[key] !== '') {
        for (const meritev of this.meritve) {
          if (meritev.id === +key && meritev.sp_meja !== null && meritev.zg_meja !== null) {
            if ( form.value[key] >= meritev.sp_meja && form.value[key] <= meritev.zg_meja ) {
              form.setValidators([Validators.required, this.validatorTrue.bind(this)]);
            } else {
              form.setValidators([Validators.required, this.validatorFalse.bind(this)]);
            }
          }
        }
      }
    }
  }

  validatorFalse(c: FormControl): {[s: string]: boolean;} {
    return {'wrong': true};
  }

  validatorTrue(c: FormControl): {[s: string]: boolean;} {
    return null;
  }

  pridobiVezanegaPacienta(id: number) {
    this.vezaniPacienti = [];
    this.obiskiService.getVezaniPacienti(id).subscribe(
      response => {
        this.vezaniPacienti.push(response);
      }
    );
  }

  nastaviVrednost(id: string) {
    for (const meritev of this.obisk.id_meritev) {
      if (meritev.id_meritve === +id) {
        return meritev.vrednost;
      }
    }
  }

  onSubmit(form: NgForm) {
    let data = <any>{};
    data.id_obisk = [];
    data.id_meritve = [];
    data.vrednost = [];
    if (form.valid) {
      for (let key in form.value) {
        let post = true;
        if (form.value.hasOwnProperty(key) && form.value[key] !== '') {
          for (const el of this.obisk.id_meritev) {
            if (el.id_meritve === +key && el.vrednost !== form.value[key]) {
              let dat = <any>{};
              dat.vrednost = form.value[key];
              this.obiskiService.updateMeritevNaObisku(el.id, dat).subscribe(
                response => {
                  this.poslano = true;
                  this.uspeh = true;
                },
                error => {
                  this.poslano = true;
                  this.uspeh = false;
                }
              );
              post = false;
            }
          }
          if (post) {
            data.id_obisk.push(this.obisk.id);
            data.id_meritve.push(+key);
            data.vrednost.push(form.value[key]);
          }
        }
      }
    }
    if (data.length > 0) {
      this.obiskiService.postMeritve(data).subscribe(
        response => {
          this.poslano = true;
          this.uspeh = true;
          const data = {'jeOpravljen': true};
          this.obiskiService.updateStatus(this.obisk.id, data).subscribe(
            response => console.log(response)
          );
        },
        error => {
          this.poslano = true;
          this.uspeh = false;
        }
      );
    }
  }
}
