import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Pacient } from '../../models/index';
import { Config } from '../../config/env.config';
// import 'rxjs/add/operator/do';  // for debugging

@Injectable()
export class UporabnikService {
  
  constructor(private http: Http) {

  }

  pozabljenoGeslo(podatki: any): Observable<any> {
	
    return this.http.post(Config.API + 'racuni/pozabljenogeslo/', podatki)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }
  
  novoGeslo(id: string, podatki : any): Observable<any> {
  
	return this.http.put(Config.API + 'racuni/potrditevgesla/' + id + '/', podatki)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
