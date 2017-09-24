import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

export let callbackUrl = 'localhost';

@Injectable()
export class AuthService {
    constructor(public http: Http) {
    }

    login(username: string, password: string): Observable<number> {
        return this.http.post(callbackUrl, {username, password})
            .map(r => r.json());
    }
}

