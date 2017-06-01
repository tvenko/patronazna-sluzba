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
export class DelavecService {
  baseURL: any;
  token: any;

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {

  }

  getDelavce(): Observable<any> {
	return this.http.get(Config.API + 'racuni/delavci/')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  get(delavec: string): Observable<string[]> {
    return this.http.get(Config.API + 'racuni/uporabniki/' + delavec + '/')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  getBySifraUsluzbenca(delavec: string): Observable<string[]> {
    return this.http.get(Config.API + 'racuni/delavci/' + delavec + '/')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  getByVrstaDelavca(delavec: any): Observable<string[]> {
    return this.http.get(Config.API + 'racuni/delavci/?vd=' + delavec)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  ustvari(delavec: any): Observable<string[]> {
    return this.http.post(Config.API + 'racuni/delavci/',  delavec)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }
  
  posodobi(delavec: any): Observable<string[]> {
    return this.http.put(Config.API + 'racuni/posodobiosebje/' + delavec.osebna_sifra.toString() + '/',  delavec)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string} The Observable for the HTTP request.
   */
  getVrsteDelavcev(): Observable<string[]> {
    return this.http.get(Config.API + 'racuni/vrstedelavcev/')
                    .map((res: Response) => res.json())
    //              .do(data => console.log('server data:', data))  // debug
                    .catch(this.handleError);
  }

  query(query: string): Observable<any> {
    return this.http.get(Config.API + 'racuni/delavci?q0=' + query)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  queryZdravniki(query: string): Observable<any> {
    return this.http.get(Config.API + 'racuni/delavci?q1=' + query)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  querySestre(query: string): Observable<any> {
    return this.http.get(Config.API + 'racuni/delavci?q2=' + query)
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

  getMS(): Observable<any> {
    return this.http.get(Config.API + 'racuni/sestre/')
                    .map((res: Response) => res.json());
  }

  nadomestiMS(sestra: any, body: any): Observable<any> {
    return this.http.patch(Config.API + 'racuni/sestra/' + sestra + '/nadomesti/', body)
                    .map((res: Response) => res.json());
  }

  getVrnjeneMS(): Observable<any> {
    return this.http.get(Config.API + 'racuni/vrnjenesestre/')
                    .map((res: Response) => res.json());
  }

  zakljuciNadomescanje(id: string): Observable<any> {
    let body = {};
    return this.http.patch(Config.API + 'racuni/sestra/' + id + '/vrni/', body)
                    .map((res: Response) => res.json());
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
