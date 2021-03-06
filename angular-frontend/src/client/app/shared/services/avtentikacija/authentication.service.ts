import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Config } from '../../config/env.config';

@Injectable()
export class AuthenticationService {
    public token: string;
    public datumStr: string;
    public id: string;

    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.id = '';
		//localStorage.setItem('stLogin', "0");
		//localStorage.setItem('loginTime', "0");
    }

    prijava(username: string, password: string): Observable<boolean> {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

        return this.http.post(Config.API + 'token/auth/', JSON.stringify({ email: username, password: password }), {headers: headers})
            .map(
				(response : Response) => {

					var time = new Date().getTime();
					var loginTime;
					if (!localStorage.getItem('loginTime'))
						loginTime = 0;
					else
						loginTime = parseInt(localStorage.getItem('loginTime'));
					var timeLeft = ((15 * 1000) - (time - loginTime)) / 1000;
					if (timeLeft > 0) {
						var timeLeftInt = Math.ceil(timeLeft);
						localStorage.setItem('loginError', 'Prijava blokirana za ' + timeLeftInt.toString() + ' sekund.');
						return false;
					}

					if (response.json().pacient && response.json().pacient[0].je_aktiviran == false) {
						localStorage.setItem('loginError', 'Račun ni aktiviran.');
						return false;
					}
					else {
						let token = response.json() && response.json().token;
						if (token) {

							//določi id uporabnika
							this.id = JSON.stringify(response.json().uporabnik.id);

							//določi trenutni datum za shranjevanje v bazo
							var trenutniDatum = new Date();

							//spremeni datum v pravilen format za shranjevanje v bazo
							var day = trenutniDatum.getDate() + '';
							if (day.length === 1)
								day = '0' + trenutniDatum.getDate();
							var month = (trenutniDatum.getMonth() + 1) + '';
							if (month.length === 1)
								month = '0' + (trenutniDatum.getMonth() + 1);
							var milisekundeTemp = trenutniDatum.getMilliseconds();
							milisekundeTemp = milisekundeTemp * 60 / 100;
							var milisekunde = milisekundeTemp + '';
							milisekunde = milisekunde.substring(0,2);

							this.datumStr = trenutniDatum.getFullYear() + '-' + month + '-' + day + ' ' + trenutniDatum.getHours() + ':' + trenutniDatum.getMinutes() + ':' + milisekunde;

							//ali je uporabnik admin?
							var admin = JSON.stringify(response.json().uporabnik.je_admin);

              //id uporabnika
							var uId = JSON.stringify(response.json().uporabnik.id);

							//pridobi datum zadnje prijave
							var datumObj = response.json().uporabnik.last_login;
							var dateAgain = '';

							if (datumObj !== null) {
								//spremeni datum v slovenski format
								var ura = datumObj.substring(11,13);
								//zelo grd način prilagajanja časovnega pasa
								//ura = (parseInt(ura) + 2) + "";
								dateAgain = datumObj.substring(8,10) + '-' + datumObj.substring(5,7) + '-' + datumObj.substring(0,4) + ' ' + ura + datumObj.substring(13,19);
							}
							else {
								dateAgain = 'Prva prijava';
							}

							// določi tip uporabnika in nastavi podatke pacienta
							var tipUporabnika = '';
							if (response.json().pacient) {
								tipUporabnika = 'pacient';
								localStorage.setItem('podatkiPacienta', JSON.stringify(response.json().pacient[0]));

							}
							else if (response.json().delavec) {
								tipUporabnika = response.json().delavec[0].naziv_delavca;
								localStorage.setItem('podatkiIzvajalca', JSON.stringify(response.json().delavec[0]));
							}

							// določi token
							this.token = token;
							// shrani uporabniško ime, jwt token in tip uporabika lokalno
							localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token, tipUporabnika: tipUporabnika, admin: admin, datum: dateAgain, id:  uId}));
							// vrni true za uspešno prijavo
							return true;
						}
						else {
							//če se zgornji if ne sproži, gre v spodnji catch, do else sploh ne pride (je pa prisoten da ne teži prevajalnik)
							localStorage.setItem('loginError', 'Uporabniško ime / geslo je nepravilno.');
							return false;
						}
					}
				}
			)
			.catch(this.handleError);
    }

    odjava(): Observable<boolean> {

		var headers = new Headers();
		headers.append('Authorization', 'JWT ' + this.token);
		headers.append('Content-Type', 'application/json');

		// počisti token in podatke uporabnika iz lokalnega pomnilnika
		this.token = null;
		localStorage.removeItem('currentUser');
		if (localStorage.getItem('podatkiPacienta')) {
			localStorage.removeItem('podatkiPacienta');
		}
		if (localStorage.getItem('loginError')) {
			localStorage.removeItem('loginError');
		}
		localStorage.setItem('loginTime', '0');
		localStorage.setItem('stLogin', '0');
		//pošlji datum prijave
		if (this.id.length !== 0) {

			return this.http.patch(Config.API + 'racuni/uporabniki/' + this.id + '/', JSON.stringify({ last_login: this.datumStr }), {headers: headers})
				.map(
					(response : Response) => {
						return true;
					}
				)
				.catch(this.handleError);
		}
		else {
			return Observable.of(true);
		}
    }

	private handleError (error: any) {
		let errMsg = (error.message) ? error.message :
		  error.status ? `${error.status} - ${error.statusText}` : 'Server error';

		var stLogin;
		if (!localStorage.getItem('stLogin'))
			stLogin = 0;
		else
			stLogin = parseInt(JSON.parse(localStorage.getItem('stLogin')));
		stLogin++;
		localStorage.setItem('stLogin', stLogin.toString());
		var time = new Date().getTime();
		var loginTime;
		if (!localStorage.getItem('loginTime'))
			loginTime = 0;
		else
			loginTime = parseInt(localStorage.getItem('loginTime'));
		var timeLeft = ((15 * 1000) - (time - loginTime)) / 1000;
		if (timeLeft > 0) {
			var timeLeftInt = Math.ceil(timeLeft);
			localStorage.setItem('loginError', 'Prijava blokirana za ' + timeLeftInt.toString() + ' sekund.');
		}
		else {
			if (stLogin > 3) {
				localStorage.setItem('stLogin', '1');
			}
			localStorage.setItem('loginError', 'Uporabniško ime / geslo je nepravilno.');
		}
		if (stLogin == 3) {
			var time = new Date().getTime();
			localStorage.setItem('loginTime', time.toString());
		}

		return Observable.of(false);
	}
}
