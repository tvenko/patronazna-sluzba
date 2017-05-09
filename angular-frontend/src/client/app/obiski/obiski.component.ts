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
  public planiraniObiski: any;
  public prihajajociObiski: any;
  stObiskovPlanirani: number;
  stStraniPlanirani: number;
  trenutnaStranPlanirani: number = 1;
  stObiskovPrihajajoci: number;
  stStraniPrihajajoci: number;
  trenutnaStranPrihajajoci: number = 1;

  constructor(private ObiskiService: ObiskiService) {}

  ngOnInit() {
    this.pridobiObiske();
  }

  pridobiObiske() {
    let user = localStorage.getItem('podatkiIzvajalca');
    if (user) {
      user = JSON.parse(user).osebna_sifra;
      this.ObiskiService.getPlanirani(user, this.trenutnaStranPlanirani)
        .subscribe(
          response => {
            this.planiraniObiski = response.results;
            this.stObiskovPlanirani = response.count;
            this.stStraniPlanirani = Math.floor(this.stObiskovPlanirani/10)+1;
          }
        );
      this.ObiskiService.getPrihajajoci(user, this.trenutnaStranPrihajajoci)
        .subscribe(
          response => {
            this.prihajajociObiski = response.results;
            this.stObiskovPrihajajoci = response.count;
            this.stStraniPrihajajoci = Math.floor(this.stObiskovPrihajajoci/10)+1;
          }
        );
    } else {
      console.log('Ni izvajalca v local storage');
    }
  }

  jePredviden(dejanskiDatum: Date) {
    var dejanski: Date = new Date(dejanskiDatum);
    if (dejanski.toDateString() === this.today.toDateString())
      return true;
    return false;
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

  onNextPage(vrsta: string) {
    if(vrsta === 'prihajajoci') {
      if (this.trenutnaStranPrihajajoci < this.stStraniPrihajajoci)
        this.trenutnaStranPrihajajoci++;
    } else {
      if (this.trenutnaStranPlanirani < this.stStraniPlanirani)
        this.trenutnaStranPlanirani++;
    }
    this.pridobiObiske();
  }

  onPreviousPage(vrsta: string) {
    if(vrsta === 'prihajajoci') {
      if (this.trenutnaStranPrihajajoci >1)
        this.trenutnaStranPrihajajoci--;
    } else {
      if (this.trenutnaStranPlanirani >1)
        this.trenutnaStranPlanirani--;
    }
    this.pridobiObiske();
  }
}
