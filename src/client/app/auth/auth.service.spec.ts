import {} from 'jasmine';
import {AuthService} from './auth.service';
import {async, ComponentFixture, inject} from '@angular/core/testing';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {Http, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {AuthGuard} from './auth-guard';
import {Core} from '../../testing/core';
import {AppComponent} from '../app.component';
import {AuthServiceStub} from '../../testing/auth-stubs';
import {AuthManager} from './auth.manager';
import {Observable} from 'rxjs/Observable';
import {identityResources} from '../../../config/identityResources';
import {AuthUserBlueprint} from '../../testing/auth-user.blueprint';
import {LogService} from '../core/log/log.service';
import {MailgunValidatorService} from './mailgun-validate.service';

describe('AuthService', () => {
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(() => {
        fixture = Core.createAppWithShared([], [
            {
                path: 'auth',
                loadChildren: './auth.module#AuthModule'
            }
        ]);
    });

    it(
        'can instantiate service when service is injected',
        inject([AuthService], (service: AuthService) => {
            expect(service instanceof AuthServiceStub).toBe(true);
        }));

    it(
        'can instantiate AuthGuard',
        inject([AuthGuard], (service: AuthGuard) => {
            expect(service instanceof AuthGuard).toBe(true);
        }));

    it(
        'can provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        })
    );

    describe('isLoggedIn', () => {
        let api: Http;
        let backend: MockBackend;
        let service: AuthService;
        let authManager: AuthManager;
        let response: Response;

        beforeEach(inject(
            [Http, LogService, AuthManager, MockBackend, MailgunValidatorService],
            (http: Http, log: LogService, auth: AuthManager, be: MockBackend, mailgun: MailgunValidatorService) => {
                backend = be;
                api = http;
                authManager = auth;
                service = new AuthService(http, log, auth, mailgun);
                const options = new ResponseOptions({status: 200, body: {data: {auth_token: 'token'}}});
                response = new Response(options);
            }));

        it('should check AuthManger for a token', () => {
            const spy = spyOn(authManager, 'getToken');

            service.isLoggedIn();

            expect(spy.calls.any()).toBe(true, 'AuthManger.getToken');
        });

        it('returns true if a token exists', () => {
            spyOn(authManager, 'getToken').and.returnValue({});

            expect(service.isLoggedIn()).toBe(true, 'should be true when token exists');
        });

        it('returns false if a token does not exist', () => {
            spyOn(authManager, 'getToken').and.returnValue(null);

            expect(service.isLoggedIn()).toBe(false, 'should be false when token does not exists');
        });
    });

    describe('login', () => {
        const token = 'token';
        let api: Http;
        let backend: MockBackend;
        let service: AuthService;
        let authManager: AuthManager;
        let response: Response;
        let logService: LogService;
        const testAuthUser = AuthUserBlueprint.default();

        beforeEach(inject(
            [Http, LogService, AuthManager, MockBackend, MailgunValidatorService],
            (http: Http, log: LogService, auth: AuthManager, be: MockBackend, mailgun: MailgunValidatorService) => {
                backend = be;
                api = http;
                authManager = auth;
                logService = log;
                service = new AuthService(http, log, auth, mailgun);
                const options = new ResponseOptions({status: 200, body: 'token'});
                response = new Response(options);
            }));

        it('should set token on success', async(() => {
            const spy = spyOn(authManager, 'setToken').and.returnValue(token);

            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

            service.login(testAuthUser)
                .do(status => {
                    expect(status).toEqual(true, 'should return login success');
                    expect(spy.calls.first().args[0]).toBe(token, 'should store getToken in localStorage');
                });
        }));

        it('should not set getToken if response status is not an OK status', async(() => {
            const spy = spyOn(localStorage, 'setItem');
            const resp = new Response(new ResponseOptions({status: 204}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.login(testAuthUser)
                .do(status => {
                    expect(status).toEqual(false, 'should return login success');
                    expect(spy.calls.any()).toBe(false, 'should not store getToken in localStorage');
                });
        }));

        it('should treat error as an Observable error', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 500, body: {success: false}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.login(testAuthUser)
                .do(() => {
                    fail('should not respond with success');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null);
                })
            ;
        })));

        it('should log error', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 500, body: {success: false}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            const spy = spyOn(logService, 'error');

            service.login(testAuthUser)
                .subscribe(() => {
                }, () => {
                });

            expect(spy.calls.count()).toEqual(1);
        })));

        it('should call get on authorize url', async(() => {
            const spy = spyOn(api, 'get').and.callThrough();
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

            service.login(testAuthUser)
                .do(() => {
                    expect(spy.calls.any()).toBe(true, 'get http request should have been made');
                    expect(spy.calls.first().args[0])
                        .toContain(identityResources.tokenUrl, 'http request should have been made');
                });
        }));

        it('should add login auth header', async(() => {
            const spy = spyOn(api, 'get').and.callThrough();
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

            const base64UserCredentials = `Basic ${btoa(testAuthUser.name + ':' + testAuthUser.password)}`;

            service.login(testAuthUser)
                .do(() => {
                    expect(spy.calls.any()).toBe(true, 'get http request should have been made');
                    const headers: Headers = spy.calls.first().args[1].headers;
                    expect(headers.has('Authorization')).toBe(true, 'authorization header should exist');
                    expect(headers.get('Authorization'))
                        .toBe(base64UserCredentials, 'authorization header value should be base64 creds');
                });
        }));
    });

    describe('Logout', () => {
        let authManagerStub: AuthManager;
        let service: AuthService;

        beforeEach(inject(
            [Http, LogService, AuthManager, XHRBackend, MailgunValidatorService],
            (http: Http, log: LogService, auth: AuthManager, mailgun: MailgunValidatorService) => {
                authManagerStub = auth;
                service = new AuthService(http, log, auth, mailgun);
            }));

        it('should call AuthManager.clear', () => {
            const spy = spyOn(authManagerStub, 'clear');

            service.logout();

            expect(spy.calls.count()).toBe(1, 'AuthManager.clear should be called');
        });
    });

});


