import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {} from 'jasmine';
import {MockBackend} from '@angular/http/testing';
import {AppComponent} from '../app.component';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Core} from '../../testing/core';
import {AuthGuard} from './auth-guard';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {AuthModule} from './auth.module';

describe('AuthGuard', function () {
    let fixture: ComponentFixture<AppComponent>;
    let router: Router;
    let location: Location;
    let xhr: MockBackend;
    let comp: AppComponent;
    let guard: AuthGuard;

    // mock everything the SharedModule includes because we need to override AuthService
    beforeEach(() => {
        fixture = Core.createAppWithShared([AuthModule], [
            {
                path: 'auth',
                component: LoginComponent,
                data: {roles: ['user', 'anonymous']}
            },
            {
                path: 'logout',
                component: LogoutComponent,
                data: {roles: ['user']}
            },
            {
                path: 'login',
                component: LoginComponent,
                data: {roles: ['anonymous']}
            }
        ]);
        comp = fixture.componentInstance;
        comp.ngOnInit();
        router = fixture.debugElement.injector.get(Router);
        xhr = fixture.debugElement.injector.get(MockBackend);
        location = fixture.debugElement.injector.get(Location);
        guard = TestBed.get(AuthGuard);
    });

    it('should load AuthGuard', () => {
        expect(guard instanceof AuthGuard);
    });

    // arbitrarily convert the route from above to an ActivatedRouteSnapshot,
    // not really any other way to test guards?
    function tomfoolery(route: string, numRoles = 1): ActivatedRouteSnapshot {
        return <ActivatedRouteSnapshot>router.config
            .filter(c => c.path === route && typeof c.data !== 'undefined'
            && c.data.roles.length === numRoles)[0];
    }

    it('should show page if accessible to all', () => {
        spyOn(localStorage, 'getItem').and.returnValue(void 0);
        const result = guard.canActivate(tomfoolery('auth', 2), null);
        expect(result).toBe(true);
    });

    it('should show page if anonymous has the role', () => {
        spyOn(localStorage, 'getItem').and.returnValue(void 0);
        const result = guard.canActivate(tomfoolery('login'), null);
        expect(result).toBe(true);
    });

    it('should not show page if anonymous does not have the role', () => {
        spyOn(localStorage, 'getItem').and.returnValue(void 0);
        const result = guard.canActivate(tomfoolery('logout'), null);
        expect(result).toBe(false);
    });

    it('should not show page if user does not have the role', () => {
        spyOn(localStorage, 'getItem').and.returnValue({});
        const result = guard.canActivateChild(tomfoolery('login'), null);
        expect(result).toBe(false);
    });

    it('should show page if user does have the role', () => {
        spyOn(localStorage, 'getItem').and.returnValue({});
        const result = guard.canActivateChild(tomfoolery('logout'), null);
        expect(result).toBe(true);
    });
});


