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
  danPlana: Date = new Date;

  public planiraniObiski: any;

  public prihajajociObiski: any;
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
      user = JSON.parse(user).osebna_sifra;
      this.ObiskiService.getPlanirani(user)
        .subscribe(
          response => {
            this.planiraniObiski = response;
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
    const data = {'jeOpravljen': true};
    this.ObiskiService.updateStatus(id, data).subscribe(
      response => {this.pridobiObiske();}
    );
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
