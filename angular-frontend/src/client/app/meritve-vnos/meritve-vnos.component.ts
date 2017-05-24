import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObiskiService } from '../shared/services/obiski/obiski.service';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'sd-meritve-vnos',
  templateUrl: 'meritve-vnos.component.html',
  styleUrls: ['meritve-vnos.component.css']
})
export class MeritveVnosComponent implements OnInit {
  id: number;
  obisk: any;
  vezaniPacienti: any;
  meritve: any[] = [];
  test: any;
  uspeh: boolean;
  poslano = false;

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

  pridobiVezanegaPacienta(id: number) {
    this.vezaniPacienti = [];
    this.obiskiService.getVezaniPacienti(id).subscribe(
      response => {
        this.vezaniPacienti.push(response);
      }
    );
  }

  onSubmit(form: NgForm) {
    let data = <any>{};
    data.id_obisk = [];
    data.id_meritve = [];
    data.vrednost = [];
    if (form.valid) {
      for(let key in form.value) {
        if(form.value.hasOwnProperty(key) && form.value[key] !== '') {
          data.id_obisk.push(this.obisk.id);
          data.id_meritve.push(+key);
          data.vrednost.push(form.value[key]);
        }
      }
    }
    this.obiskiService.postMeritve(data).subscribe(
      response => {
        this.poslano = true;
        this.uspeh = true;
      },
      error => {
        this.poslano = true;
        this.uspeh = false;
      }
    );
  }
}
