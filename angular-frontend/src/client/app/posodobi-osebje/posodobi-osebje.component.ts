import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DelavecService } from '../shared/services/index';

/**
 * This class represents the lazy loaded DelovniNalogComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'posodobi-osebje',
  templateUrl: 'posodobi-osebje.component.html',
  styleUrls: ['posodobi-osebje.component.css'],
})
export class PosodobiOsebjeComponent implements OnInit {

  public delavci: any;
  
  constructor(public delavecService: DelavecService,  private router: Router) {}

  ngOnInit() {
	this.dobiDelavce();
  }
  
 dobiDelavce() {
	this.delavecService.getDelavce()
	.subscribe(
     response => {
		this.delavci = response.results;
     },
     error => {
       console.log("error");
     }
   );
 }

  redirect(idNaloga: any) {
    this.router.navigateByUrl('/posodobi-osebje/' + idNaloga);
  }

}
