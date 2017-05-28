import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ObiskiService, DelavecService, PacientService } from '../shared/services/index';

/**
* This class represents the lazy loaded PodrobnostiObiskComponent.
*/
@Component({
  moduleId: module.id,
  selector: 'sd-obisk-podrobnosti',
  templateUrl: 'podrobnosti-obisk.component.html',
  styleUrls: ['podrobnosti-obisk.component.css']
})
export class PodrobnostiObiskComponent implements OnInit {
    public idObiska: any;
    public tipUporabnika: any;
    public obisk: any;
    public errorNalaganja: any;
    public errorCode: any;

    constructor(private activatedRoute: ActivatedRoute,
                private obiskService: ObiskiService, private delavecService: DelavecService, private pacientService: PacientService,
                private router: Router) {}

    ngOnInit() {
      // Ceski nacin za prikaz navbara
      this.tipUporabnika = JSON.parse(localStorage.getItem('currentUser')).tipUporabnika;
      // Pridobi id delovnega naloga iz naslova
      this.activatedRoute.params.subscribe((params: Params) => {
        let idObiska = params['idObiska'];
        this.idObiska = idObiska;
        this.getObisk(idObiska);
      });

    }

    getObisk(id: number) {
      this.errorNalaganja = '';
      this.obiskService.getById(id).subscribe(
        response => {
          this.obisk = response;
          //console.log(this.obisk);
          this.getImenaSester();
          this.getPodatkiZdravnika();
          this.getPodatkiPacienta();
          if (this.obisk.vezani_pacienti.length > 0) {
            this.getPodatkiVezanca(0);
          }
        },
        error => {
          this.errorNalaganja = error;
        }
      );
    }

    getImenaSester() {
      this.delavecService.get(this.obisk.patronazna_sestra).subscribe(
        (response: any) => {
          var pId = this.obisk.patronazna_sestra;
          this.obisk.patronazna_sestra = {};
          this.obisk.patronazna_sestra.id = pId;
          this.obisk.patronazna_sestra.ime = (response.ime+' '+response.priimek);
          this.obisk.patronazna_sestra.email = (response.email);
          this.obisk.patronazna_sestra.tel = (response.tel);
        });
      if(this.obisk.nadomestna_patronazna_sestra) this.delavecService.get(this.obisk.nadomestna_patronazna_sestra).subscribe(
          (response: any) => {
            var pId = this.obisk.nadomestna_patronazna_sestra;
            this.obisk.nadomestna_patronazna_sestra = {};
            this.obisk.nadomestna_patronazna_sestra.id = pId;
            this.obisk.nadomestna_patronazna_sestra.ime = (response.ime+' '+response.priimek);
            this.obisk.nadomestna_patronazna_sestra.email = (response.email);
            this.obisk.nadomestna_patronazna_sestra.tel = (response.tel);
          });
    }

    getPodatkiZdravnika() {
      this.delavecService.getBySifraUsluzbenca(this.obisk.zdravnik.osebna_sifra).subscribe(
        (response: any) => {
          this.obisk.zdravnik.email = (response.email);
          this.obisk.zdravnik.tel = (response.tel);
        });
    }

    getPodatkiPacienta() {
      this.pacientService.get(this.obisk.pacient.stevilkaPacienta).subscribe(
        (response: any) => {
          //console.log(response);
          this.obisk.pacient.email = (response.eposta);
          //this.obisk.pacient.spol = response.spol ? "moški" : "ženska";
          this.obisk.pacient.rojstni_dan = response.datumRojstva;
          this.obisk.pacient.posta = response.posta;
        });
    }
    getPodatkiVezanca(dn: number) {
      if (dn >= this.obisk.vezani_pacienti.length) return;
      this.pacientService.getVezancka(this.obisk.vezani_pacienti[dn]).subscribe(
        (response: any) => {
          this.obisk.vezani_pacienti[dn] = {};
          this.obisk.vezani_pacienti[dn].ime = response.ime +' ' + response.priimek;
          this.obisk.vezani_pacienti[dn].spol = response.spol ? "moški" : "ženska";
          this.obisk.vezani_pacienti[dn].datum_rojstva = response.datum_rojstva;
          this.obisk.vezani_pacienti[dn].razmerje = response.sorodstveno_razmerje;
          this.obisk.vezani_pacienti[dn].id = response.st_kartice;
          //console.log(this.obisk.vezani_pacienti[dn]);
          dn++;
          this.getPodatkiVezanca(dn);
        });
    }

    // Preusmeri nazaj na seznam obiskov
    nazajNaPregled() {
      this.router.navigateByUrl('/seznam-obiskov');
      // window.history.back();
    }

    redirect(idNaloga: any) {
      this.router.navigateByUrl('/nalogi/' + idNaloga);
    }
}
