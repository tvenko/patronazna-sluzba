import { Component, OnInit } from '@angular/core';
import { ObiskiService } from '../shared/services/index';

@Component({
  moduleId: module.id,
  selector: 'sd-obiski',
  templateUrl: 'obiski.component.html',
  styleUrls: ['obiski.component.css'],
})
export class ObiskiComponent implements OnInit {
  today: Date = new Date();
  public obiski: any;
  stObiskov: number;
  stStrani: number;
  trenutnaStran: number = 1;

  constructor(private ObiskiService: ObiskiService) {}

  ngOnInit() {
    this.pridobiObiske();
  }

  pridobiObiske() {
    let user = localStorage.getItem('podatkiIzvajalca');
    if (user) {
      console.log(user);
      user = JSON.parse(user).osebna_sifra;
      this.ObiskiService.getByDelavec(user, this.trenutnaStran)
        .subscribe(
          response => {
            this.obiski = response.results;
            this.stObiskov = response.count;
            this.stStrani = Math.floor(this.stObiskov/10)+1;
          },
          error => {
            // Pokazi obvestilo
          }
        );
    } else {
      console.log('Ni izvajalca v local storage');
    }
  }

  jePredviden(dejanskiDatum: Date, predvidenDatum: Date, jeObvezen: Boolean, jeOpravljen: Boolean) {
    var dejanski: Date = new Date(dejanskiDatum);
    var predvideni: Date = new Date(predvidenDatum);
    if (dejanski.toDateString() === this.today.toDateString() && !jeOpravljen ||
      jeObvezen && !jeOpravljen && predvideni.toDateString() === this.today.toDateString()) {
      return true;
    }
    return false;
  }

  jePonujen(dejanskiDatum: any, jeObvezen: Boolean) {
    if (dejanskiDatum || jeObvezen)
      return false;
    return true;
  }

  onOpravljenObisk(id: number) {
    const data = {'jeOpravljen': true};
    this.ObiskiService.updateStatus(id, data).subscribe();
    this.pridobiObiske();
  }

  onIzberiDatum(id: number, datum: Date) {
    var d: Date = new Date(datum);
    let data = <any>{};
    data.dejanskiDatum = d;
    this.ObiskiService.updateDejanskiDatum(id, data).subscribe();
    this.pridobiObiske();
  }

  onNextPage() {
    if(this.trenutnaStran < this.stStrani)
      this.trenutnaStran++;
    this.pridobiObiske();
  }

  onPreviousPage() {
    if(this.trenutnaStran > 1)
      this.trenutnaStran--;
    this.pridobiObiske();
  }
}
