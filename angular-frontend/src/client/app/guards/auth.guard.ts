import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
 
@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate() {
        if (localStorage.getItem('currentUser')) {
            // uporabnik je prijavljen
			//console.log(JSON.parse(localStorage.getItem('currentUser')).tipUporabnika);
			//console.log(JSON.parse(localStorage.getItem('podatkiPacienta')).ime);
            return true;
        }
 
        // uporabnik ni prijavljen
        this.router.navigate(['/prijava']);
        return false;
    }
}