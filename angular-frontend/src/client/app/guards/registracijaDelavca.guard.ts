import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
@Injectable()
export class RegistracijaDelavcaGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate() {

        if (JSON.parse(localStorage.getItem('currentUser')).admin) {
            
			return true;
        }
 
        this.router.navigate(['/ni-dostopa.html']);
        return false;
    }
}