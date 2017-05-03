import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
 
import { AuthenticationService } from '../shared/services/avtentikacija/authentication.service';
 
@Component({
    moduleId: module.id,
    templateUrl: 'prijava.component.html',
		styleUrls: ['prijava.component.css']
})
 
export class PrijavaComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
  	@ViewChild('register') registerLink: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }
 
    ngOnInit() {
        // resetiraj status prijave
        this.authenticationService.odjava()
          .subscribe(result => {});
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
										// MS TODO
										if (imeUporabnika === 'admin@gmail.com') {
											this.router.navigate(['/']);
										}	else if (tipUporabnika === 'pacient') {
											this.router.navigate(['/pacient/profil']);
										} else if (tipUporabnika === 'zdravnik' || tipUporabnika === 'vodja PS') {
											this.router.navigate(['/nalogi']);
										} else if (tipUporabnika === 'patronažna sestra') {
										  this.router.navigate(['/obiski']);
                    } else {
											this.router.navigate(['/']);
										}
                } else {
                    // prijava neuspešna
                    this.error = localStorage.getItem('loginError');
                    this.loading = false;
                }
            });
    }
}
