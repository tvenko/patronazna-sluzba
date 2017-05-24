import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
 
@Injectable()
export class NadomescanjeMSGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate() {

		    var uporabnik = JSON.parse(localStorage.getItem('currentUser')).tipUporabnika;
        if (uporabnik === 'vodja PS') {  
          return true;
        }
 
        this.router.navigate(['/ni-dostopa']);
        return false;
    }
}
