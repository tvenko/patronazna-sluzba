import { Component, OnInit } from '@angular/core';
import { ObiskiService } from '../shared/services/index';

@Component({
  moduleId: module.id,
  selector: 'sd-obiski',
  templateUrl: 'obiski.component.html',
  styleUrls: ['obiski.component.css'],
})
export class ObiskiComponent implements OnInit {
  public obiski: any;

  constructor(private ObiskiService: ObiskiService) {}

  ngOnInit() {
    this.pridobiObiske();
  }

  pridobiObiske() {
    let user = localStorage.getItem('podatkiIzvajalca');
    if (user) {
      console.log(user);
      user = JSON.parse(user).osebna_sifra;
      this.ObiskiService.getByDelavec(user)
        .subscribe(
          response => {
            this.obiski = response.results;
          },
          error => {
            // Pokazi obvestilo
          }
        );
    } else {
      console.log('Ni izvajalca v local storage');
    }

  }
}
