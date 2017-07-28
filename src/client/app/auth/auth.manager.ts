import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthManager {
    private tokenId = 'token';

    constructor(public helper: JwtHelper) {
    }

    getToken(): string {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(this.tokenId);
        } else {
            return '';
        }
    }

    getDecodedToken(): any {
        const token = JSON.parse(this.getToken());
        if (token != null) {
            return this.helper.decodeToken(token.access_token);
        } else {
            return void 0;
        }
    }

    tokenExpired(): boolean {
        const expires = false;
        const token = this.getDecodedToken();
        const now: any = new Date().getTime() / 1000;
        if (token && token.auth_time) {
            const expire: any = new Date(token.auth_time).getTime() + 3600;
            const expiresIn = expire - now;

            return expiresIn < 1;
        } else {
            return expires;
        }
    }

    getHeaders(): Headers {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const token = JSON.parse(this.getToken());
        if (token != null) {
            headers.append('Authorization', 'Bearer ' + token.access_token);
        }

        return headers;
    }

    setToken(token: string): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.tokenId, token);
        }
    }

    clear(): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(this.tokenId);
        }
    }
}
