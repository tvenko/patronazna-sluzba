import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Config } from '../../config/env.config';

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    prijava(username: string, password: string): Observable<boolean> {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
        return this.http.post(Config.API + 'token/auth/', JSON.stringify({ email: username, password: password }), {headers: headers})
            .map(
				(response : Response) => {
					let token = response.json() && response.json().token;
					if (token) {

						// določi tip uporabnika in nastavi podatke pacienta
						var tipUporabnika = "";
						if (response.json().pacient) {
							tipUporabnika = "pacient";
							localStorage.setItem('podatkiPacienta', JSON.stringify(response.json().pacient[0]));
						}
						else if (response.json().delavec) {
							tipUporabnika = response.json().delavec[0].naziv_delavca;
              localStorage.setItem('podatkiIzvajalca', JSON.stringify(response.json().delavec[0]));
						}

						// določi token
						this.token = token;
						// shrani uporabniško ime, jwt token in tip uporabika lokalno
						localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token, tipUporabnika: tipUporabnika }));
						// vrni true za uspešno prijavo
						return true;
					}
					else {
						//če se zgornji if ne sproži, gre v spodnji catch, do else sploh ne pride (je pa prisoten da ne teži prevajalnik)
						return false;
					}
				}
			)
			.catch(this.handleError);
    }

    odjava(): void {
        // počisti token iz lokalnega pomnilnika
        this.token = null;
        localStorage.removeItem('currentUser');
		if (localStorage.getItem('podatkiPacienta')) {
			localStorage.removeItem('podatkiPacienta');
		}
    }

	private handleError (error: any) {
		let errMsg = (error.message) ? error.message :
		  error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.error(errMsg);
		return Observable.of(false);
	}
}
