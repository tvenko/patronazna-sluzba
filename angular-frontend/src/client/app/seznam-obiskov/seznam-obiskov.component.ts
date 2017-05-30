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
  selector: 'seznam-obiskov',
  templateUrl: 'seznam-obiskov.component.html',
  styleUrls: ['seznam-obiskov.component.css'],
})
export class SeznamObiskovComponent implements OnInit {

  public tipUporabnikaSestra: boolean = false;

  public delovniNalogi: any;
  public podrobniNalog: any;

  public najdeniPacienti: any;
  public najdeneSestre: any;
  public najdeniZdravniki: any;

  public filterForm: FormGroup;
  public vrsteObiskov: any;
  public problemPridobivanja: boolean;
  public si: any;
  public query: string;

  public izbranPacient: any;
  public izbranaSestra: any;
  public izbranaSestraNad: any;
  public izbranIzdajatelj: any;

  public prikaziPodrobnosti: boolean;

  public queryNext: any;
  public queryPrev: any;

  public stStrani: number;
  public trenutnaStran: number;

  constructor(private fb: FormBuilder, private delovniNalogService: DelovniNalogService, public pacientService: PacientService, public delavecService: DelavecService,  private obiskiService: ObiskiService, private router: Router) {}

  ngOnInit() {
    //pridobi prijavljenega uporabnika
    this.tipUporabnikaSestra = JSON.parse(localStorage.getItem('currentUser')).tipUporabnika === 'patronažna sestra';

    // dobi zdravnike
    // dobi sestre
    this.pridobiNaloge();
    this.dobiVrsteObiskov();
    this.prikaziPodrobnosti = false;
    this.filterForm = this.fb.group({
      predvideniDatumOd: [''],
      predvideniDatumDo: [''],
      dejanskiDatumDo: [''],
      dejanskiDatumOd: [''],
      vrstaObiska: [''],
      izdajatelj: [''],
      pacient: [''],
      sestra: [''],
      nSestra: [''],
      opravljeni: [''],
      neopravljeni: [''],
    });

    this.si = {
            firstDayOfWeek: 0,
            dayNames: ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
            dayNamesShort: ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'],
            dayNamesMin: ['Ne','Po','To','Sr','Če','Pe','So'],
            monthNames: [ 'Januar','Februar','Marec','April','Maj','Junij','Julij','Avgust','September','Oktober','November','December' ],
            monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun','Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec' ]
    };

    this.trenutnaStran = 1;
    let sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
    sifra_zdravnika = JSON.parse(sifra_zdravnika).osebna_sifra;
    this.query = '?user=' + sifra_zdravnika + '&page=1';
    this.podrobniNalog = {};
  }

  dobiVrsteObiskov() {
   this.problemPridobivanja = false;
   this.delovniNalogService.getVrsteObiskov()
   .subscribe(
     response => {
      //  if (JSON.parse(localStorage.getItem('currentUser')).tipUporabnika === 'vodja PS') {
      //    this.vrsteObiskov = [];
      //    var that = this;
      //    (response as any).results.forEach(function(entry:any) {
      //      if (entry.id < 4)
      //        that.vrsteObiskov.push(entry);
      //    });
      //  } else {
         this.vrsteObiskov = (response as any).results;
      //  }

     },
     error => {
       this.problemPridobivanja = true;
     }
   );
 }

  pacientIzbran(event: any) { this.izbranPacient = event; }
  sestraIzbrana(event: any) { this.izbranaSestra = event; }
  sestraNadIzbrana(event: any) { this.izbranaSestraNad = event; }
  izdajateljIzbran(event: any) { this.izbranIzdajatelj = event; }

  searchPacient(event: any) {
    this.pacientService.query(event.query).subscribe(
       response => {
         this.najdeniPacienti = response.results;
         for (let najden of this.najdeniPacienti) {
           najden.naziv = najden.ime + ' ' + najden.priimek + ' ('+ najden.stevilkaPacienta +')';
         }
       },
       error => {
         console.log('Napaka pri iskanju pacienta');
       }
     );
   }
  searchSestra(event: any) {
    this.delavecService.querySestre(event.query).subscribe(
         response => {
           this.najdeneSestre = response.results;
           for (let najdena of this.najdeneSestre) {
             najdena.naziv = najdena.ime + ' ' + najdena.priimek;
           }
         },
         error => {
           console.log('Napaka pri iskanju sestre');
         }
       );
  }
  searchIzdajatelj(event: any) {
    this.delavecService.queryZdravniki(event.query).subscribe(
         response => {
           this.najdeniZdravniki = response.results;
           for (let najdena of this.najdeniZdravniki) {
             najdena.naziv = najdena.ime + ' ' + najdena.priimek;
           }
         },
         error => {
           console.log('Napaka pri iskanju izdajalca');
         }
       );
  }

  displayFilter() {
    this.prikaziPodrobnosti = true;
  }

  buildQuery(podatki: any) {
    let sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
    sifra_zdravnika = JSON.parse(sifra_zdravnika).osebna_sifra;
    this.query = '?user=' + sifra_zdravnika;

    // console.log(podatki.predvideniDatumOd);
    // console.log(podatki.predvideniDatumDo);
    // console.log(podatki.dejanskiDatumOd);
    // console.log(podatki.dejanskiDatumDo);

    // p datum od
    if (podatki.predvideniDatumOd) this.query += '&zac_pdat=' + podatki.predvideniDatumOd.toISOString().substr(0, 10);
    // p datum do
    if (podatki.predvideniDatumDo) this.query += '&konc_pdat=' + podatki.predvideniDatumDo.toISOString().substr(0, 10);
    // d datum od
    if (podatki.dejanskiDatumOd) {
      this.query += '&zac_ddat=' + podatki.dejanskiDatumOd.toISOString().substr(0, 10);
      var offset = (24*60*60*1000);
      podatki.dejanskiDatumOd = new Date (podatki.dejanskiDatumOd.getTime()-offset);
    }
    // d datum do
    if (podatki.dejanskiDatumDo) this.query += '&konc_ddat=' + podatki.dejanskiDatumDo.toISOString().substr(0, 10);
    // izdajatelj
    if (this.izbranIzdajatelj) this.query += '&izd=' + this.izbranIzdajatelj.osebna_sifra;
    // pacient
    if (this.izbranPacient) this.query += '&pac=' + this.izbranPacient.stevilkaPacienta;
    // sestra
    if (this.izbranaSestra) this.query += '&ms=' + this.izbranaSestra.osebna_sifra;
    // nadomestna sestra
    if (this.izbranaSestraNad) this.query += '&nms=' + this.izbranaSestraNad.osebna_sifra;
    // vrsta obiska
    if (podatki.vrstaObiska) this.query += '&vo=' + podatki.vrstaObiska.id;
    //opravljeni ali ne
    if (podatki.opravljeni && !podatki.neopravljeni) this.query += '&opr=True';
    else if (!podatki.opravljeni && podatki.neopravljeni) this.query += '&opr=False';

    // stran
    this.query += '&page=1';

    // zapisi query v console
    //console.log(this.query);

    return this.query;
  }

  onNextPage() {
    if (this.trenutnaStran < this.stStrani) this.trenutnaStran++;
    this.query = (this.query.substring(0, this.query.length-1)+this.trenutnaStran);
    //console.log(this.query);
    this.filtrirajNaloge();
  }

  onPreviousPage() {
    if (this.trenutnaStran >1) this.trenutnaStran--;
    this.query = (this.query.substring(0, this.query.length-1)+this.trenutnaStran);
    //console.log(this.query);
    this.filtrirajNaloge();
  }

  filtrirajSubmit(podatki: any) {
    this.prikaziPodrobnosti = false;
    this.query = this.buildQuery(podatki);
    this.trenutnaStran = 1;
    this.filtrirajNaloge();
  }

  resetValues() {
    this.izbranPacient = null;
    this.izbranaSestra = null;
    this.izbranaSestraNad = null;
    this.izbranIzdajatelj = null;
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

  test(nalog: any) {
    this.podrobniNalog = nalog;
    this.prikaziPodrobnosti = true;
  }

  pridobiNaloge() {
    let sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
    if (sifra_zdravnika) {
      sifra_zdravnika = JSON.parse(sifra_zdravnika).osebna_sifra;
      this.obiskiService.getByDelavec(sifra_zdravnika, 1)
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
    } else {
      console.log('Ni izvajalca v local storage');
    }
  }

  redirect(idObiska: any) {
    this.router.navigateByUrl('/obiski/' + idObiska);
  }

}
