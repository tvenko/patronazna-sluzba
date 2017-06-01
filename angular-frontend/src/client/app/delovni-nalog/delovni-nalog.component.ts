import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DelovniNalogService } from '../shared/services/index';
import { PacientService } from '../shared/services/index';
import { DelavecService } from '../shared/services/index';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

/**
 * This class represents the lazy loaded DelovniNalogComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-nalog',
  templateUrl: 'delovni-nalog.component.html',
  styleUrls: ['delovni-nalog.component.css'],
})
export class DelovniNalogComponent implements OnInit {

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

  public stStrani: any;
  public trenutnaStran: number;

  constructor(private fb: FormBuilder, private delovniNalogService: DelovniNalogService, public pacientService: PacientService, public delavecService: DelavecService,  private router: Router) {}

  ngOnInit() {
    //pridobi prijavljenega uporabnika
    this.tipUporabnikaSestra = JSON.parse(localStorage.getItem('currentUser')).tipUporabnika === 'patronažna sestra';

    // dobi zdravnike
    // dobi sestre
    this.pridobiNaloge();
    this.dobiVrsteObiskov();
    this.prikaziPodrobnosti = false;
    this.filterForm = this.fb.group({
      datumOd: [''],
      datumDo: [''],
      vrstaObiska: [''],
      izdajatelj: [''],
      pacient: [''],
      sestra: [''],
      nSestra: [''],
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
  this.pacientService.query(event.query)
   .subscribe(
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
           console.log('Napaka pri iskanju sestre');
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


    //console.log(podatki.datumDo);

    // datum od
    if (podatki.datumOd) this.query += '&zac_dat=' + podatki.datumOd.toISOString().substr(0, 10);
    // datum do
    if (podatki.datumDo) {
      var offset = (24*60*60*1000);
      podatki.datumDo = new Date (podatki.datumDo.getTime()+offset);
      this.query += '&konc_dat=' + podatki.datumDo.toISOString().substr(0, 10);
    }
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

  getImenaPacientov(dn: any) {
    this.pacientService.get(this.delovniNalogi[dn].id_pacienta).subscribe(
      (response: any) => {
        this.delovniNalogi[dn].ime_pacienta = (response.ime+' '+response.priimek);
        dn++;
        if (dn == this.delovniNalogi.length) return;
        this.getImenaPacientov(dn);
      });
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

  getImenaZdravnikov(dn: any) {
    this.delavecService.getBySifraUsluzbenca(this.delovniNalogi[dn].sifra_zdravnika).subscribe(
      (response: any) => {
        this.delovniNalogi[dn].izdajatelj = (response.ime+' '+response.priimek);
        dn++;
        if (dn == this.delovniNalogi.length) return;
        this.getImenaZdravnikov(dn);
      });
  }

  getImenaObiskov(dn: any) {
    this.delovniNalogService.getVrsteObiskovById(this.delovniNalogi[dn].vrsta_obiska).subscribe(
      (response: any) => {
        this.delovniNalogi[dn].ime_obiska = (response.opis);
        dn++;
        if (dn == this.delovniNalogi.length) return;
        this.getImenaObiskov(dn);
      });
  }

  getImenaMaterialov(nalog: any, dn: any) {
    if (!(nalog.material.length>0)) return;
    this.delovniNalogService.getMaterialById(nalog.material[dn].id_materiala).subscribe(
      (response: any) => {
        this.podrobniNalog.material[dn].ime_materiala = (response.opis);
        dn++;
        if (dn == this.podrobniNalog.material.length) return;
        this.getImenaMaterialov(nalog, dn);
      });
  }

  filtrirajNaloge() {
    this.delovniNalogService.filterDN(this.query)
      .subscribe(
        response => {
          this.delovniNalogi = response.results;
          this.queryNext = response.next;
          this.queryPrev = response.previous;
          //console.log(this.queryNext + ' ' + this.queryPrev);
          if (this.delovniNalogi.length > 0) {
            this.getImenaPacientov(0);
            this.getImenaSester(0);
            this.getImenaObiskov(0);
            this.getImenaZdravnikov(0);
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
    this.getImenaMaterialov(this.podrobniNalog, 0);
    this.prikaziPodrobnosti = true;
  }

  pridobiNaloge() {
    let sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
    if (sifra_zdravnika) {
      sifra_zdravnika = JSON.parse(sifra_zdravnika).osebna_sifra;
      this.delovniNalogService.getByDelavec(sifra_zdravnika)
        .subscribe(
          response => {
            // console.log(response.count);
            this.delovniNalogi = response.results;
            this.queryNext = response.next;
            this.queryPrev = response.previous;
            //console.log(this.queryNext + ' ' + this.queryPrev);
            if (this.delovniNalogi.length > 0) {
              this.getImenaPacientov(0);
              this.getImenaSester(0);
              this.getImenaObiskov(0);
              this.getImenaZdravnikov(0);
              this.podrobniNalog = this.delovniNalogi[0];
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

  redirect(idNaloga: any) {
    this.router.navigateByUrl('/nalogi/' + idNaloga);
  }

}
