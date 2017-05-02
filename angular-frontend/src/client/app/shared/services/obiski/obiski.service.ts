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

  get(obisk: any): Observable<string[]> {
    return this.http.get(Config.API + 'obiski/obiski/',  obisk)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getByDelavec(delavec: any): Observable<any> {
    return this.http.get(Config.API + 'obiski/obiski?user=' + delavec)
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
