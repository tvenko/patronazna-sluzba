import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {
    public token: string;
 
    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }
 
    prijava(username: string, password: string): Observable<boolean> {
        return this.http.post('http://localhost:8000/api/v1/token/auth/', JSON.stringify({ email: username, password: password }), {headers:{'Content-Type': 'application/json'}})
            .map(
				(response : Response) => {
					let token = response.json() && response.json().token;
					if (token) {
						// določi token
						this.token = token;
						// shrani uporabniško ime in jwt token lokalno
						localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
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
    }
	
	private handleError (error: any) {
		let errMsg = (error.message) ? error.message :
		  error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.error(errMsg);
		return Observable.of(false);
	}
}