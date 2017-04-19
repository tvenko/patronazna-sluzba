import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
 
@Injectable()
export class KreiranjeNalogaGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate() {
		
		var uporabnik = JSON.parse(localStorage.getItem('currentUser')).tipUporabnika;
        if (uporabnik == "zdravnik" || uporabnik == "vodja PS") {
            
			return true;
        }
 
        this.router.navigate(['/ni-dostopa.html']);
        return false;
    }
}