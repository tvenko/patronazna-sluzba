import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DelovniNalogService } from '../shared/services/index';
import { PacientService } from '../shared/services/index';
import { DelavecService } from '../shared/services/index';
import { ObiskiService } from '../shared/services/index';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

/**
 * This class represents the lazy loaded SeznamObiskovComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'seznam-obiskov-pacient',
  templateUrl: 'seznam-obiskov-pacient.component.html',
  styleUrls: ['seznam-obiskov-pacient.component.css'],
})
export class SeznamObiskovPacientComponent implements OnInit {

  public tipUporabnikaSestra: boolean = false;

  public delovniNalogi: any;
  public podrobniNalog: any;

  public problemPridobivanja: boolean;

  public query: string;

  public queryNext: any;
  public queryPrev: any;

  public stStrani: number;
  public trenutnaStran: number;
  public pacient: any;

  constructor(private fb: FormBuilder, private delovniNalogService: DelovniNalogService, public pacientService: PacientService, public delavecService: DelavecService,  private obiskiService: ObiskiService, private router: Router) {}

  ngOnInit() {
    //pridobi prijavljenega uporabnika
    // this.tipUporabnikaSestra = JSON.parse(localStorage.getItem('currentUser')).tipUporabnika === 'patronažna sestra';

    this.pacient = JSON.parse(localStorage.getItem('podatkiPacienta'));
    if (!this.pacient) {
      this.pacient = {};
    }

    // dobi zdravnike
    // dobi sestre
    this.pridobiNaloge();

    this.trenutnaStran = 1;
    // let sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
    // sifra_zdravnika = JSON.parse(sifra_zdravnika).osebna_sifra;
    //this.query = '?user=' + this.pacient.stevilkaPacienta + '&page=1';
    this.podrobniNalog = {};
  }

  buildQuery() {
    // let sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
    // sifra_zdravnika = JSON.parse(sifra_zdravnika).osebna_sifra;
    // ugly :D
    this.query = '?user=56722';

    // pacient
    if (this.pacient) this.query += '&pac=' + this.pacient.stevilkaPacienta;

    //opravljeni ali ne
    this.query += '&opr=True';

    // stran
    this.query += '&page=1';


    return this.query;
  }

  onNextPage() {
    if (this.trenutnaStran < this.stStrani) this.trenutnaStran++;
    console.log(this.query);
    this.query = (this.query.substring(0, this.query.length-1)+this.trenutnaStran);
    console.log(this.query);
    this.filtrirajNaloge();
  }

  onPreviousPage() {
    if (this.trenutnaStran >1) this.trenutnaStran--;
    this.query = (this.query.substring(0, this.query.length-1)+this.trenutnaStran);
    console.log(this.query);
    this.filtrirajNaloge();
  }

  getImenaSester(dn: any) {
    this.delavecService.get(this.delovniNalogi[dn].patronazna_sestra).subscribe(
      (response: any) => {
        this.delovniNalogi[dn].ime_sestre = (response.ime+' '+response.priimek);
        dn++;
        if (dn == this.delovniNalogi.length) return;
        this.getImenaSester(dn);
      });
  }

  getImenaNadSester(dn: any) {
      this.delavecService.get(this.delovniNalogi[dn].nadomestna_patronazna_sestra).subscribe(
        (response: any) => {
          this.delovniNalogi[dn].ime_nadomestne_sestre = (response.ime+' '+response.priimek);
          dn++;
          if (dn == this.delovniNalogi.length) return;
          this.getImenaNadSester(dn);
        });
  }

  filtrirajNaloge() {
    //this.query = this.buildQuery();
    this.obiskiService.filterObisk(this.query)
      .subscribe(
        response => {
          //console.log(response);
          this.delovniNalogi = response.results;
          this.queryNext = response.next;
          this.queryPrev = response.previous;
          //console.log(response.next + ' | ' + response.previous);
          if (response.results.length > 0) {
            this.getImenaSester(0);
            this.getImenaNadSester(0);
            this.stStrani = Math.floor(response.count/10)+1;
          }
        },
        error => {
          // Pokazi obvestilo
        }
      );

  }

  pridobiNaloge() {
    // let sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
    // if (sifra_zdravnika) {
      // sifra_zdravnika = JSON.parse(sifra_zdravnika).osebna_sifra;
      this.query = this.buildQuery();
      console.log(this.query);
      this.obiskiService.filterObisk(this.query)
        .subscribe(
          response => {
            this.delovniNalogi = response.results;
            this.queryNext = response.next;
            this.queryPrev = response.previous;
            //console.log(this.queryNext + ' ' + this.queryPrev);
            if (this.delovniNalogi.length > 0) {
              this.getImenaSester(0);
              this.getImenaNadSester(0);
              this.stStrani = Math.floor(response.count/10)+1;
            }
          },
          error => {
            // Pokazi obvestilo
          }
        );
    // } else {
      // console.log('Ni izvajalca v local storage');
    // }
  }

  redirect(idObiska: any) {
    this.router.navigateByUrl('/obiski/' + idObiska);
  }

}
