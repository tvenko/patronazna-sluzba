import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 
import { AuthenticationService } from '../shared/services/avtentikacija/authentication.service';
 
@Component({
    moduleId: module.id,
    templateUrl: 'prijava.component.html'
})
 
export class PrijavaComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
 
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }
 
    ngOnInit() {
        // resetiraj status prijave
        this.authenticationService.odjava()
			.subscribe(result => {
			});
    }
 
	prijava() {
        this.loading = true;
        this.authenticationService.prijava(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    // prijava uspešna, pojdi na domačo stran
										let tipUporabnika = JSON.parse(localStorage.getItem('currentUser')).tipUporabnika;
										let imeUporabnika = JSON.parse(localStorage.getItem('currentUser')).username;

										// Admin TODO (izboljsaj varnost?)
										if (imeUporabnika === 'admin@gmail.com') {
											this.router.navigate(['/'])
										}	else if (tipUporabnika === 'pacient') {
                    	this.router.navigate(['/pacient/profil']);
										} else if (tipUporabnika === 'zdravnik' || tipUporabnika === 'vodja PS') {
											this.router.navigate(['/nalogi']);
										} else {
											this.router.navigate(['/']);
										}
                } else {
                    // prijava neuspešna
                    this.error = 'Uporabniško ime in/ali geslo je nepravilno.';
                    this.loading = false;
                }
            });
    }
}
