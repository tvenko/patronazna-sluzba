import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DelovniNalogService } from '../shared/services/index';
import { ObiskiService } from '../shared/services/index';

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
    public idNaloga: any;
    public tipUporabnika: any;
    public delovniNalog: any;
    public errorNalaganja: any;
    public errorCode: any;
    public jeIzdajateljNaloga: boolean;
    public seNimaObiskov: boolean;
    sifra_zdravnika: any;

    constructor(private activatedRoute: ActivatedRoute,
                private delovniNalogService: DelovniNalogService, public obiskiService: ObiskiService,
                private router: Router) {}

    ngOnInit() {
      // Ceski nacin za prikaz navbara
      this.tipUporabnika = JSON.parse(localStorage.getItem('currentUser')).tipUporabnika;
      this.sifra_zdravnika = localStorage.getItem('podatkiIzvajalca');
      this.sifra_zdravnika = JSON.parse(this.sifra_zdravnika).osebna_sifra;
      //console.log(this.sifra_zdravnika);
      // Pridobi id delovnega naloga iz naslova
      this.activatedRoute.params.subscribe((params: Params) => {
        let idNaloga = params['idNaloga'];
        this.idNaloga = idNaloga;
        this.getDelovniNalog(idNaloga);
      });


    }

    imaObiske() {
      for (var o in this.delovniNalog.obiski)
        if (this.delovniNalog.obiski[o].je_opravljen == "da") {
          console.log(this.delovniNalog.obiski[o]);
          return true;
        }
      return false;
    }

    zbrisiMeritev(id: number) {
      this.obiskiService.deleteMeritev(id).subscribe(
        response => {
          console.log("zbrisana meritev "+id);
        },
        error => {
          console.log("error brisanje meritev "+id);
        }
      );
    }

    zbrisiObisk(id: number) {
      this.obiskiService.delete(id).subscribe(
        response => {
          console.log("zbrisan obisk "+id);
        },
        error => {
          console.log("error brisanje obisk "+id);
        }
      );
    }

    zbrisiNalog() {
      // alert kao sigurno želite zbrisat?

      // najdi obiske
      for (var o in this.delovniNalog.obiski) {
        // console.log(this.delovniNalog.obiski[o].id);
        // za vsak obisk meritve - ne rabi
        // for (var m in this.delovniNalog.obiski[o].id_meritev) {
        //   //console.log(this.delovniNalog.obiski[o].id_meritev[m]);
        //   // zbrisi meritve
        //   this.zbrisiMeritev(this.delovniNalog.obiski[o].id_meritev[m]);
        // }
        // zbrisi obiske
        this.zbrisiObisk(this.delovniNalog.obiski[o].id);
      }
      // zbrisi nalog
      //console.log("brisem nalog...");

      this.delovniNalogService.delete(this.idNaloga).subscribe(
        response => {
          console.log("zbrisan obisk "+this.idNaloga);
        },
        error => {
          console.log("error brisanje obisk "+this.idNaloga);
        }
      );

      alert("Nalog je bil uspešno zbrisan!");
      // nazajNaPregled()
    }


    // Pridobi podronosti za delovni nalog, za katerega se izpisujejo podrobnosti
    getDelovniNalog(id: number) {
      this.errorNalaganja = '';
      this.delovniNalogService.get(id).subscribe(
        response => {
          this.delovniNalog = response;
          if (this.delovniNalog.pacient.spol)
            this.delovniNalog.pacient.spol = 'moški';
          else
            this.delovniNalog.pacient.spol = 'ženski';

          if (this.delovniNalog.je_obvezen_datum)
            this.delovniNalog.je_obvezen_datum = 'da';
          else
            this.delovniNalog.je_obvezen_datum = 'ne';

          for (let obisk of this.delovniNalog.obiski) {
            if (obisk.je_opravljen)
              obisk.je_opravljen = 'da';
            else
              obisk.je_opravljen = 'ne';
          }

          for (let otrok of this.delovniNalog.vezani_pacienti) {
            if (otrok.spol)
              otrok.spol = 'moški';
            else
              otrok.spol = 'ženski';
          }
          //console.log(response);
          if (response.zdravnik.osebna_sifra == this.sifra_zdravnika) this.jeIzdajateljNaloga = true;
          else this.jeIzdajateljNaloga = false;
          this.seNimaObiskov = !this.imaObiske();
          console.log(this.seNimaObiskov);
        },
        error => {
          this.errorNalaganja = error;
        }
      );
    }

    // Preusmeri nazaj na pregled nalogov
    nazajNaPregled() {
      this.router.navigateByUrl('/nalogi');
      // window.history.back();
    }
}
