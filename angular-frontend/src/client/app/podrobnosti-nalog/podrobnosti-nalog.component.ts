import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DelovniNalogService } from '../shared/services/index';

/**
* This class represents the lazy loaded PodrobnostiNalogComponent.
*/
@Component({
  moduleId: module.id,
  selector: 'sd-nalog-podrobnosti',
  templateUrl: 'podrobnosti-nalog.component.html',
  styleUrls: ['podrobnosti-nalog.component.css']
})
export class PodrobnostiNalogComponent implements OnInit {
    //public idNaloga: any;
    public tipUporabnika: any;
    public delovniNalog: any;
    public errorNalaganja: any;

    constructor(private activatedRoute: ActivatedRoute,
                private delovniNalogService: DelovniNalogService,
                private router: Router) {}

    ngOnInit() {
      // Ceski nacin za prikaz navbara
      this.tipUporabnika = JSON.parse(localStorage.getItem('currentUser')).tipUporabnika;
      // Pridobi id delovnega naloga iz naslova
      this.activatedRoute.params.subscribe((params: Params) => {
        let idNaloga = params['idNaloga'];
        this.getDelovniNalog(idNaloga);
      });


    }

    // Pridobi podronosti za delovni nalog, za katerega se izpisujejo podrobnosti
    getDelovniNalog(id: number) {
      this.errorNalaganja = '';
      this.delovniNalogService.get(id).subscribe(
        response => {
          this.delovniNalog = response;
        },
        error => {
          this.errorNalaganja = error;
          console.log('Napaka pri pridobivanju delovnega naloga');
        }
      )
    }

    // Preusmeri nazaj na pregled nalogov
    nazajNaPregled() {
      this.router.navigateByUrl('/nalogi');
    }
}
