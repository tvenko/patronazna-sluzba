import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../config/env.config';
// import 'rxjs/add/operator/do';  // for debugging
import 'rxjs/add/observable/of';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class DelovniNalogService {
  baseURL: any;
  token: any;

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {

  }

  ustvari(nalog: any): Observable<string[]> {
    return this.http.post(Config.API + 'dn/delovninalogi/',  nalog)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
  * Pridobi tocno dolocen delovni nalog
  */
  get(id: number): Observable<any> {
    return this.http.get(Config.API + 'dn/delovninalogi/' + id + '/')
                    .map((res: Response) => res.json())
  }

  delete(id: number): Observable<any> {
    return this.http.delete(Config.API + 'dn/delovninalogi/' + id + '/')
                    .map((res: Response) => res.json())
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string} The Observable for the HTTP request.
   */
  getVrsteObiskov(): Observable<string[]> {
    return this.http.get(Config.API + 'dn/vrsteobiskov/')
                    .map((res: Response) => res.json())
    //              .do(data => console.log('server data:', data))  // debug
                    .catch(this.handleError);
  }


  getVrsteObiskovById(id: any): Observable<string[]> {
    return this.http.get(Config.API + 'dn/vrsteobiskov/'+id+'/')
                    .map((res: Response) => res.json())
    //              .do(data => console.log('server data:', data))  // debug
                    .catch(this.handleError);
  }

  /**
   * Vrne vsa zdravila v bazi
   * @return {string} seznam zdravil
   */
  getZdravila(): Observable<any[]> {
    return this.http.get(Config.API + 'dn/zdravila/')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Vrne vse vrste epruvet v bazi
   * @return {string} seznam epruvet
   */
   getEpruvete(): Observable<any[]> {
     return this.http.get(Config.API + 'dn/material/')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
   }

   getMaterialById(id: any): Observable<any[]> {
     return this.http.get(Config.API + 'dn/material/'+id+'/')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
   }

   getByDelavec(zdravnik: any): Observable<any> {
     return this.http.get(Config.API + 'dn/delovninalogi?user=' + zdravnik)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
   }

   filterDN(query: string): Observable<any> {
     return this.http.get(Config.API + 'dn/delovninalogi' + query)
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
