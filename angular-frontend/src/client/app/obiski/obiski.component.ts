import { Component, OnInit } from '@angular/core';
import { ObiskiService } from '../shared/services/index';

import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'sd-obiski',
  templateUrl: 'obiski.component.html',
  styleUrls: ['obiski.component.css'],
})
export class ObiskiComponent implements OnInit {
  today: Date = new Date();
  yesterday: Date = new Date();
  public danPlana: Date = new Date;

  public vezaniPacienti: any[];
  public planiraniObiski: any;

  public prihajajociObiski: any;
  stObiskov: number;
  stStrani: number;
  trenutnaStran: number = 1;

  danasnjiObiski: any = {};
  public danasnjaZdravila: any = {};
  public danasnjiMaterial: any = {};
  public prikaziMaterial: boolean;

  constructor(private ObiskiService: ObiskiService, private router: Router) {}

  ngOnInit() {
    this.yesterday.setDate(this.yesterday.getDate()-1);
    this.pridobiObiske();
  }

  pridobiObiske() {
    let user = localStorage.getItem('podatkiIzvajalca');
    if (user) {
      user = JSON.parse(user).osebna_sifra;
      this.ObiskiService.getPlanirani(user)
        .subscribe(
          response => {
            this.planiraniObiski = response;
            //console.log(response);
          }
        );
      this.ObiskiService.getPrihajajoci(user, this.trenutnaStran)
        .subscribe(
          response => {
            this.prihajajociObiski = response.results;
            this.stObiskov = response.count;
            this.stStrani = Math.floor(this.stObiskov/10)+1;
          }
        );
    } else {
      console.log('Ni izvajalca v local storage');
    }
  }

  getDanasnjeObiske () {
    let user = localStorage.getItem('podatkiIzvajalca');
    user = JSON.parse(user).osebna_sifra;
    var offset = (24*60*60*1000);
    var od = new Date (this.danPlana.getTime()-offset);
    var query = '?user=' + user + '&zac_ddat=' + od.toISOString().substr(0, 10) + '&konc_ddat=' + this.danPlana.toISOString().substr(0, 10);

    this.ObiskiService.filterObisk(query)
      .subscribe(
        response => {
          this.danasnjiObiski = response.results;
          var query = '?user=' + user + '&zac_pdat=' + this.danPlana.toISOString().substr(0, 10) + '&konc_pdat=' + this.danPlana.toISOString().substr(0, 10);
          this.ObiskiService.filterObisk(query)
            .subscribe(
              response => {
                for (var i in response.results) {
                  if (response.results[i].je_obvezen_datum)
                    this.danasnjiObiski.push(response.results[i]);
                }

                console.log(this.danasnjiObiski);

                // make material array
                this.danasnjiMaterial={};
                for (var i in this.danasnjiObiski) {
                  if (this.danasnjiObiski[i].material.length > 0) {
                    for (var m in this.danasnjiObiski[i].material) {
                      //this.danasnjiMaterial.push(this.danasnjiObiski[i].material[m]);
                      if (!this.danasnjiMaterial[this.danasnjiObiski[i].material[m].opis]) this.danasnjiMaterial[this.danasnjiObiski[i].material[m].opis] = 0;
                      this.danasnjiMaterial[this.danasnjiObiski[i].material[m].opis] += this.danasnjiObiski[i].material[m].kolicina;
                    }
                  }
                  if (this.danasnjiObiski[i].zdravila.length > 0) {
                    for (var z in this.danasnjiObiski[i].zdravila) {
                      if (!this.danasnjiMaterial[this.danasnjiObiski[i].zdravila[z].naziv]) this.danasnjiMaterial[this.danasnjiObiski[i].zdravila[z].naziv] = 0;
                      this.danasnjiMaterial[this.danasnjiObiski[i].zdravila[z].naziv]++;
                    }
                  }
                }
                console.log(this.danasnjiMaterial);
                this.prikaziMaterial = true;
              },
              error => {
                // Pokazi obvestilo
              }
            );
        },
        error => {
          // Pokazi obvestilo
        }
      );



  }

  test(event: any) {
    console.log(event);
  }

  pridobiVezanegaPacienta(ids: any) {
    this.vezaniPacienti = [];
    for (let id of ids) {
      this.ObiskiService.getVezaniPacienti(id).subscribe(
        response => {
          this.vezaniPacienti.push(response);
        }
      );
    }
  }

  jePredviden(dejanskiDatum: Date, predvideniDatum: Date, obvezen: Boolean) {
    var dejanski: Date = new Date(dejanskiDatum);
    var predvideni: Date = new Date(predvideniDatum);
    if (dejanski.toDateString() === this.danPlana.toDateString() ||
        predvideni.toDateString() === this.danPlana.toDateString() && obvezen) {
      return true;
    }
    return false;
  }

  onOpravljenObisk(id: number) {
    this.router.navigate(['/meritve', 'vnos']);
  }

  onIzberiDatum(id: number, datum: Date) {
    var d: Date = new Date(datum);
    let data = <any>{};
    data.dejanskiDatum = d;
    this.ObiskiService.updateDejanskiDatum(id, data).subscribe(
      response => {this.pridobiObiske();}
    );
  }

  onNextPage() {
    if (this.trenutnaStran < this.stStrani)
        this.trenutnaStran++;
    this.pridobiObiske();
  }

  onPreviousPage() {
    if (this.trenutnaStran >1)
      this.trenutnaStran--;
    this.pridobiObiske();
  }
}
