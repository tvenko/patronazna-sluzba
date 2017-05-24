import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../config/env.config';
import 'rxjs/add/operator/do';  // for debugging
// import 'rxjs/add/observable/of';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class ObiskiService {
  baseURL: any;
  token: any;

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {

  }

  getById(id: number) {
    return this.http.get(Config.API + 'obiski/obiski/' + id)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getByDelavec(delavec: any, stran: number): Observable<any> {
    return this.http.get(Config.API + 'obiski/obiski?user=' + delavec + '&page=' + stran)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getPlanirani(delavec: any) {
    return this.http.get(Config.API + 'obiski/planirani?user=' + delavec)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getPrihajajoci(delavec: any, stran: number) {
    return this.http.get(Config.API + 'obiski/prihajajoci?user=' + delavec + '&page=' + stran)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getVezaniPacienti(id: number) {
    return this.http.get(Config.API + 'racuni/vezanipacienti/' + id)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getMeritve(idVrsteObiska: number) {
    return this.http.get(Config.API + 'obiski/meritve?vrsta=' + idVrsteObiska)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  postMeritve(data: any) {
    return this.http.post(Config.API + 'obiski/meritvenaobisku/', data)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  updateStatus(id: number, data: any) {
    return this.http.put(Config.API + 'obiski/obiski/' + id + '/', data)
      .map((res: Response) => res.json)
      .catch(this.handleError);
  }

  updateDejanskiDatum(id: number, data: any): Observable<any> {
    console.log('data: ' + data);
    return this.http.put(Config.API + 'obiski/obiski/' + id + '/', data)
      .map((res: Response) => res.json)
      .catch (this.handleError);
  }

  filterObisk(query: string): Observable<any> {
    return this.http.get(Config.API + 'obiski/obiski' + query)
      .map((res: Response) => res.json())
      .catch (this.handleError);
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
