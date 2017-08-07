import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

export let callbackUrl = 'localhost';

@Injectable()
export class SearchService {
    constructor(public http: Http) {
    }

    search(query: string): Observable<number> {
        return this.http.post(callbackUrl, {query})
            .map(r => r.json());
    }

    results(query: string): Observable<Array<{ code: string, matches: Array<number> }>> {
        return this.http.post(callbackUrl, {query})
            .map(r => r.json());
    }
}
