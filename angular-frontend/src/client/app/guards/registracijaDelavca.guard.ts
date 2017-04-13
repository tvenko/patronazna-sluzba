import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
 
@Injectable()
export class RegistracijaDelavcaGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate() {
		
		//TODO: dejansko preveri, če je prijavljeni uporabnik admin
		
		var username = JSON.parse(localStorage.getItem('currentUser')).username;
        if (username == "admin@gmail.com") {
            
			return true;
        }
 
        this.router.navigate(['/ni-dostopa.html']);
        return false;
    }
}