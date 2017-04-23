import { Component, OnInit } from '@angular/core';

/**
* This class represents the lazy loaded DelovniNalogComponent.
*/
@Component({
  moduleId: module.id,
  selector: 'sd-pacient-profil',
  templateUrl: 'pacient-profil.component.html',
  styleUrls: ['pacient-profil.component.css']
})
export class PacientProfilComponent implements OnInit {
  public pacient: any;
  public datum: any;

  ngOnInit() {
    // on init
    this.pacient = JSON.parse(localStorage.getItem('podatkiPacienta'));
    if (!this.pacient)
      this.pacient = {};
	this.datum = JSON.parse(localStorage.getItem('currentUser')).datum;
  }
}
