import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
 
@Injectable()
export class RegistracijaOskrbovancaGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate() {

		var tip = JSON.parse(localStorage.getItem('currentUser')).tipUporabnika;
        if (tip == "pacient") {
            
			return true;
        }
 
        this.router.navigate(['/ni-dostopa']);
        return false;
    }
}