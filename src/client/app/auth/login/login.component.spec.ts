import {ComponentFixture} from '@angular/core/testing';
import {} from 'jasmine';
import {MockBackend} from '@angular/http/testing';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Core} from '../../../testing/core';
import {LoginComponent} from './login.component';
import {ResponseOptions} from '@angular/http';
import {By} from '@angular/platform-browser';
import {SharedModule} from '../../core/core.module';

describe('LoginComponent', function () {
    let fixture: ComponentFixture<LoginComponent>;
    let router: Router;
    let location: Location;
    let xhr: MockBackend;
    let comp: LoginComponent;

    // mock everything the SharedModule includes because we need to override AuthService
    beforeEach(() => {
        fixture = Core.createAppWithShared([SharedModule.forRoot()], [
            {
                path: 'auth/login',
                component: LoginComponent
            },
            {
                path: 'auth/register',
                component: LoginComponent
            }
        ], [LoginComponent]);
        comp = fixture.componentInstance;
        router = fixture.debugElement.injector.get(Router);
        xhr = fixture.debugElement.injector.get(MockBackend);
        location = fixture.debugElement.injector.get(Location);
        xhr.connections.subscribe((connection: any) => {
            connection.mockRespond(new Response(<ResponseOptions>{
                body: JSON.stringify('hit')
            }));
        });

    });

    it('should load LoginComponent', (done) => {
        expect(comp).not.toBeNull('should be created successfully');

        fixture.whenStable().then(() => {
            done();
        });
    });

    it('should require password', (done) => {
        const loginSpy = spyOn(comp.auth, 'login');
        fixture.whenStable().then(() => {
            comp.onLogin();
            expect(loginSpy).toHaveBeenCalledTimes(0);
            done();
        });
    });

    it('should login user', (done) => {
        const navigateSpy = spyOn(comp.router, 'navigate');
        fixture.whenStable().then(() => {
            comp.authUser.name = 'megamindbrian@gmail.com';
            comp.authUser.password = 'some password';
            comp.onLogin();
            fixture.whenStable().then(() => {
                expect(navigateSpy).toHaveBeenCalledWith(['/']);
                done();
            });
        });
    });

    it('should register a user and log in', (done) => {
        const navSpy = spyOn(comp.router, 'navigate');
        comp.isRegister = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            comp.onRegister();
            expect(navSpy.calls.any()).toBeFalsy();

            comp.registrationUser.email = 'megamindbrian@gmail.com';
            comp.registrationUser.firstName = 'Brian';
            comp.registrationUser.lastName = 'C';
            comp.registrationUser.password = 'tEst12345!';
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                comp.onRegister();
                expect(comp.message).toBeUndefined();
                expect(navSpy.calls.any()).toBeTruthy();
                done();
            });
        });
    });

    it('should switch to register form', (done) => {
        done();
    });

});

