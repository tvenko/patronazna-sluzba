import { Component, OnInit } from '@angular/core';
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

  constructor(private fb: FormBuilder, private delovniNalogService: DelovniNalogService, public pacientService: PacientService, public delavecService: DelavecService) {}

  ngOnInit() {
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
            dayNames: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota"],
            dayNamesShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
            dayNamesMin: ["Ne","Po","To","Sr","Če","Pe","So"],
            monthNames: [ "Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December" ],
            monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "Maj", "Jun","Jul", "Avg", "Sep", "Okt", "Nov", "Dec" ]
    };

    this.podrobniNalog = {};
  }

 dobiVrsteObiskov() {
   this.problemPridobivanja = false;
   this.delovniNalogService.getVrsteObiskov()
   .subscribe(
     response => {
       if (JSON.parse(localStorage.getItem('currentUser')).tipUporabnika === 'vodja PS') {
         this.vrsteObiskov = [];
         var that = this;
         (response as any).results.forEach(function(entry:any) {
           if (entry.id < 4)
             that.vrsteObiskov.push(entry);
         });
       } else {
         this.vrsteObiskov = (response as any).results;
       }

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
   )
 }

  searchSestra(event: any) {
    this.delavecService.query(event.query).subscribe(
         response => {
           this.najdeneSestre = response.results;
           for (let najdena of this.najdeneSestre) {
             najdena.naziv = najdena.ime + ' ' + najdena.priimek;
           }
         },
         error => {
           console.log('Napaka pri iskanju sestre');
         }
       )
  }

  searchIzdajatelj(event: any) {
    this.delavecService.query(event.query).subscribe(
         response => {
           this.najdeneSestre = response.results;
           for (let najdena of this.najdeneSestre) {
             najdena.naziv = najdena.ime + ' ' + najdena.priimek;
           }
         },
         error => {
           console.log('Napaka pri iskanju sestre');
         }
       )
  }

  displayFilter() {
    this.prikaziPodrobnosti = true;
  }

  buildQuery(podatki: any) {
    let sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
    sifra_zdravnika = JSON.parse(sifra_zdravnika).osebna_sifra;
    this.query = '?user=' + sifra_zdravnika;

    // datum od
    if (podatki.datumOd) this.query += '&zac_dat=' + podatki.datumOd.toISOString().substr(0, 10);
    // datum do
    if (podatki.datumDo) this.query += '&konc_dat=' + podatki.datumDo.toISOString().substr(0, 10);
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

    // zapisi query v console
    // console.log(this.query);

    return this.query;
  }

  resetValues() {
    this.izbranPacient = null;
    this.izbranaSestra = null;
    this.izbranaSestraNad = null;
    this.izbranIzdajatelj = null;
    console.log("success");
  }

  getImenaPacientov(dn: any) {
    this.pacientService.get(this.delovniNalogi[dn].id_pacienta).subscribe(
      (response: any) => {
        this.delovniNalogi[dn].ime_pacienta = (response.ime+" "+response.priimek);
        dn++;
        if (dn == this.delovniNalogi.length) return;
        this.getImenaPacientov(dn);
      });
  }

  getImenaSester(dn: any) {
    this.delavecService.get(this.delovniNalogi[dn].patronazna_sestra).subscribe(
      (response: any) => {
        this.delovniNalogi[dn].ime_sestre = (response.ime+" "+response.priimek);
        dn++;
        if (dn == this.delovniNalogi.length) return;
        this.getImenaSester(dn);
      });
  }

  getImenaZdravnikov(dn: any) {
    this.delavecService.getBySifraUsluzbenca(this.delovniNalogi[dn].sifra_zdravnika).subscribe(
      (response: any) => {
        this.delovniNalogi[dn].izdajatelj = (response.ime+" "+response.priimek);
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

  filtrirajNaloge(podatki: any) {
    this.prikaziPodrobnosti = false;
    var filterQuery = this.buildQuery(podatki);
    this.delovniNalogService.filterDN(filterQuery)
      .subscribe(
        response => {
          this.delovniNalogi = response.results;
          if (this.delovniNalogi.length > 0) {
            this.getImenaPacientov(0);
            this.getImenaSester(0);
            this.getImenaObiskov(0);
            this.getImenaZdravnikov(0);
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
            if (this.delovniNalogi.length > 0) {
              this.getImenaPacientov(0);
              this.getImenaSester(0);
              this.getImenaObiskov(0);
              this.getImenaZdravnikov(0);
              this.podrobniNalog = this.delovniNalogi[0];
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

}
