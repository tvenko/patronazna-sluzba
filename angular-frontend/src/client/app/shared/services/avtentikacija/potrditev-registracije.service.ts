import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Config } from '../../config/env.config';

@Injectable()
export class PotrditevRegistracijeService {

constructor(private http: Http) {}

potrdiRegistracijo(id: string): Observable<boolean> {

	var headers = new Headers();
	headers.append('Content-Type', 'application/json');
	
	if (id) {
		return this.http.patch(Config.API + 'racuni/potrditevregistracije/' + id + '/', JSON.stringify({ je_aktiviran: true }), {headers: headers})
			.map(
				(response : Response) => {
					return true;
				}
			)
			.catch(this.handleError);	
	}
	else {
		return Observable.of(false);	
	}
}

private handleError (error: any) {
	let errMsg = (error.message) ? error.message :
	error.status ? `${error.status} - ${error.statusText}` : 'Server error';
	console.error(errMsg);
	return Observable.of(false);
}

}