import { Component } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router, ActivatedRoute } from '@angular/router';
import { UporabnikService } from '../shared/services/index';

@Component({
  moduleId: module.id,
  selector: 'potrditev-gesla',
  templateUrl: 'potrditev-gesla.html'
})
export class PotrditevGeslaComponent {
	
	public bap : any;

constructor(private route: ActivatedRoute, private uporabnikService: UporabnikService) {}

ngOnInit() {

	this.route.params.subscribe(response => {
	
		console.log(response);
		console.log(response.id);
		console.log(response.geslo);
		var id = response.id + "";
		var geslo = response.geslo + "";
		this.bap = {"password" : geslo};
		this.uporabnikService.novoGeslo(id, this.bap)
			.subscribe(result => {
			});
	});
}
}
