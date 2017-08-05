import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

export let callbackUrl = 'localhost';

@Injectable()
export class SearchService {
    constructor(public http: Http) {
    }

    search(query: string): Observable<Response> {
        console.log('Searching ' + query);
        return this.http.post(callbackUrl, {query});
    }
}
