import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Pacient } from '../../models/index';
// import 'rxjs/add/operator/do';  // for debugging

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class PacientInfoService {
  baseURL: any;
  token: any;

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {
    this.baseURL = 'http://fruity-routy.ddns.net';
    this.token = 'OgJOsZc9wEkkrJQIUyoAdbwHtxEViMuDYm68OqJsT0oMwxjWvqEtast4PNPtfJXa'

  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * TODO nas pravi naslov za pacienta
   * @return {Pacient} The Observable for the HTTP request.
   */
  get(id: string): Observable<Pacient> {

    return this.http.get(this.baseURL + '/racuni/pacienti/' + id)
                    .map((res: Response) => res.json())
    //              .do(data => console.log('server data:', data))  // debug
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
