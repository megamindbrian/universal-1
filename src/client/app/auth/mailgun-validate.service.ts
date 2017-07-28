import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LogService } from '../../../imports/log.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MailgunValidatorService {
    public pubKey = 'pubkey-542ag12lq7thzt6432gutijiwc2klfk3';

    constructor(public http: Http,
                public log: LogService) {
    }

    validate(email: string): Observable<Response> {

        // There should be a public key
        if (!this.pubKey) {
            return Observable.throw('Provide your mailgun public key.');
        }

        // There should be an email
        if (!email) {
            return Observable.throw('Provide the email to validate.');
        }

        return this.http.get('https://api.mailgun.net/v2/address/validate?address='
            + encodeURIComponent(email)
            + '&api_key='
            + this.pubKey)
            .catch(error => {
                this.log.error(error);
                return Observable.throw(error);
            });
    }
}


