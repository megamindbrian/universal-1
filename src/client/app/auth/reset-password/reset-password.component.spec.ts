import {ComponentFixture, TestBed} from '@angular/core/testing';
import {} from 'jasmine';
import {MockBackend} from '@angular/http/testing';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Core} from '../../../testing/core';
import {ResetPasswordComponent} from './reset-password.component';
import {AuthModule} from '../auth.module';

describe('ResetPasswordComponent', function () {
    let fixture: ComponentFixture<AppComponent>;
    let router: Router;
    let location: Location;
    let xhr: MockBackend;
    let comp: AppComponent;
    let reset: ResetPasswordComponent;
    let resetFixture: ComponentFixture<ResetPasswordComponent>;

    // mock everything the SharedModule includes because we need to override AuthService
    beforeEach(() => {
        fixture = Core.createAppWithShared([AuthModule], []);
        comp = fixture.componentInstance;
        comp.ngOnInit();
        router = fixture.debugElement.injector.get(Router);
        xhr = fixture.debugElement.injector.get(MockBackend);
        location = fixture.debugElement.injector.get(Location);
        resetFixture = TestBed.createComponent(ResetPasswordComponent);
        reset = resetFixture.componentInstance;
    });

    it('should load ResetPasswordComponent', (done) => {
        fixture.whenStable().then(() => {
            expect(comp).not.toBeNull('should be created successfully');
            done();
        });
    });

    it('should reset user password', (done) => {
        const navigateSpy = spyOn((<any>reset).router, 'navigate');
        fixture.whenStable().then(() => {
            reset.onNext();
            expect(navigateSpy).toHaveBeenCalledWith(['/']);
            done();
        });
    });

});

