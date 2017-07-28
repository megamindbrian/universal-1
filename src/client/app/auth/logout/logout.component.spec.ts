import {ComponentFixture} from '@angular/core/testing';
import {} from 'jasmine';
import {MockBackend} from '@angular/http/testing';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Core} from '../../../testing/core';
import {LogoutComponent} from './logout.component';

describe('ResetPasswordComponent', function () {
    let fixture: ComponentFixture<LogoutComponent>;
    let router: Router;
    let location: Location;
    let xhr: MockBackend;
    let comp: LogoutComponent;

    // mock everything the SharedModule includes because we need to override AuthService
    beforeEach(() => {
        fixture = Core.createAppWithShared([], [], [LogoutComponent]);
        comp = fixture.componentInstance;
        comp.ngOnInit();
        router = fixture.debugElement.injector.get(Router);
        xhr = fixture.debugElement.injector.get(MockBackend);
        location = fixture.debugElement.injector.get(Location);
    });

    it('should logout user and clear token', () => {
        const authSpy = spyOn(comp.authService, 'logout');
        const navSpy = spyOn(comp.router, 'navigate');
        comp.ngOnInit();
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(navSpy).toHaveBeenCalledWith(['/']);
        expect(comp.authService.isLoggedIn());
    });

});

