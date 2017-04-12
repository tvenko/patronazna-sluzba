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
        this.authenticationService.odjava();
    }
 
	prijava() {
        this.loading = true;
        this.authenticationService.prijava(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    // prijava uspešna, pojdi na domačo stran
                    this.router.navigate(['/']);
                } else {
                    // prijava neuspešna
                    this.error = 'Uporabniško ime in/ali geslo je nepravilno.';
                    this.loading = false;
                }
            });
    }
}