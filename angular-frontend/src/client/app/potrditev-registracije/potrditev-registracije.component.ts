import { Component } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute } from '@angular/router';
import { PotrditevRegistracijeService } from '../shared/services/avtentikacija/potrditev-registracije.service';

@Component({
  moduleId: module.id,
  selector: 'potrditev-registracije',
  templateUrl: 'potrditev-registracije.html'
})
export class PotrditevRegistracijeComponent {

constructor(private route: ActivatedRoute, private potrdiRegistracijoService: PotrditevRegistracijeService) {}

ngOnInit() {

	this.route.params.subscribe(response => {
	
		var id = response.id + "";
		this.potrdiRegistracijoService.potrdiRegistracijo(id)
			.subscribe(result => {
			});
	});
}
}
