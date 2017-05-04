import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Pacient } from '../../models/index';
import { Config } from '../../config/env.config';
// import 'rxjs/add/operator/do';  // for debugging

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class PacientService {
  baseURL: any;
  token: any;

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {

  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * TODO nas pravi naslov za pacienta
   * @return {Pacient} The Observable for the HTTP request.
   */
  get(id: string): Observable<Pacient> {

    return this.http.get(Config.API + 'racuni/pacienti/' + id + '/')
                    .map((res: Response) => res.json())
    //              .do(data => console.log('server data:', data))  // debug
                    .catch(this.handleError);
  }

  ustvari(pacient: any): Observable<string[]> {
    return this.http.post(Config.API + 'racuni/pacienti/',  pacient)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  ustvariVezanega(pacient: any): Observable<string[]> {
    return this.http.post(Config.API + 'racuni/vezanipacienti/',  pacient)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  getVezancke(skrbnik: any): Observable<any> {
    return this.http.get(Config.API + 'racuni/vezanipacienti?skrbnik=' + skrbnik)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Vrne sifre okolisa
   */
  getSifreOkolisa(): Observable<any[]> {
    return this.http.get(Config.API + 'racuni/sifreokolisa/')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  getPoste(): Observable<any> {
    return this.http.get(Config.API + 'racuni/poste/')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  putGeslo(id: string, gesla: any): Observable<any> {
    return this.http.put(Config.API + 'racuni/uporabniki/' + id + '/', gesla)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  query(query: string): Observable<any> {
    return this.http.get(Config.API + 'racuni/pacienti?q=' + query)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
    * Handle HTTP error
    */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
