import { AuthManager } from './auth.manager';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AuthUser } from './login/auth-user';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { RegistrationUser } from './register-form/register-user';
import { Headers, Http, Request, Response } from '@angular/http';
import { oauthResources } from '../../../imports/oauthResources';
import { identityResources } from '../../../imports/identityResources';
import { environment } from '../../../imports/environment';
import { LogService } from '../../../imports/log.service';
import { MailgunValidatorService } from './mailgun-validate.service';

@Injectable()
export class AuthService {
    public loggedIn: ReplaySubject<boolean> = new ReplaySubject();

    static getLoginHeaders() {
        const headers = new Headers();
        const base64 = Buffer.from(`${oauthResources.client_id}:${oauthResources.client_secret}`).toString('base64');
        headers.append('Authorization', `Basic ${base64}`);
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return headers;
    }

    constructor(public http: Http,
                public log: LogService,
                public authManager: AuthManager,
                public mailgun: MailgunValidatorService) {
        this.isLoggedIn();
    }

    isLoggedIn(): boolean {
        const loggedIn = !!this.authManager.getToken();
        this.loggedIn.next(loggedIn);
        return loggedIn;
    }

    login(authUser: AuthUser): Observable<boolean> {
        const headers = AuthService.getLoginHeaders();
        const body = new URLSearchParams();
        const data: { [key: string]: any } = {
            username: authUser.name,
            password: authUser.password,
            grant_type: oauthResources.grant_type,
            scope: oauthResources.scope
        };
        Object.keys(data).forEach(k => body.set(k, (data[ k ] || '').toString()));
        const req = new Request({
            method: 'POST',
            url: environment.identityHost + identityResources.tokenUrl,
            headers,
            body: body.toString()
        });
        return this.http.request(req)
            .map(res => this.extractToken(res))
            .catch(error => {
                this.log.error(error);
                return Observable.throw(error);
            });
    }

    logout(): void {
        this.authManager.clear();
        this.isLoggedIn();
    }

    forgotPassword(email: string): Observable<Response> {
        const headers = new Headers();
        return this.http.post(
            environment.identityHost + identityResources.forgotUrl,
            {
                email,
                callbackUrl: window.location.host + '/auth/reset'
            },
            {headers})
            .catch(error => {
                this.log.error(error);
                return Observable.throw(error);
            });
    }

    passwordReset(email: string, code: string, newPassword: string, returnUrl = '') {
        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        const body = new URLSearchParams();
        const data: { [key: string]: string } = {
            email,
            code,
            password: newPassword,
            callbackUrl: window.location.host + returnUrl
        };
        Object.keys(data).forEach(k => body.set(k, data[ k ].toString()));
        return this.http.post(
            environment.identityHost + identityResources.resetUrl,
            body.toString(),
            {headers})
            .catch(error => {
                this.log.error(error);
                return Observable.throw(error);
            });
    }

    static validatePassword(pass: string) {
        if (pass.length < 8) {
            throw new Error('Password too short');
        }
        if (!(pass.match(/[a-z]/g) && pass.match(/[A-Z]/g))) {
            throw new Error('Password must contain and upper and lower case');
        }
        if (!(pass.match(/[0-9]/ig) || pass.match(/[^a-z]/ig))) {
            throw new Error('Password must contain a number or symbol');
        }
    }

    register(user: RegistrationUser) {
        const headers = new Headers();
        return this.mailgun.validate(user.email).flatMap(r => {
            AuthService.validatePassword(user.password);
            if (r.json().is_valid) {
                return this.http.post(
                    environment.identityHost + identityResources.registerUrl,
                    user,
                    {headers})
                    .catch(error => {
                        this.log.error(error);
                        return Observable.throw(error);
                    });
            } else {
                this.log.error('Invalid email: ' + user.email);
                return Observable.throw(r);
            }
        });
    }

    private extractToken(res: Response): boolean {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const success = res.status === 200;

        if (success) {
            const token = res.text();
            this.authManager.setToken(token);
        }

        this.isLoggedIn();
        return success;
    }

}
