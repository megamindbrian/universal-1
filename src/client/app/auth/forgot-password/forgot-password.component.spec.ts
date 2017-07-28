import { ComponentFixture, TestBed } from '@angular/core/testing';
import {} from 'jasmine';
import { MockBackend } from '@angular/http/testing';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Core } from '../../../testing/core';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthModule } from '../auth.module';
import { LoginComponent } from '../login/login.component';
import { Observable } from 'rxjs/Observable';

describe('ForgotPasswordComponent', function () {
    let fixture: ComponentFixture<AppComponent>;
    let router: Router;
    let location: Location;
    let xhr: MockBackend;
    let comp: AppComponent;
    let forgot: ForgotPasswordComponent;
    let forgotFixture: ComponentFixture<ForgotPasswordComponent>;

    // mock everything the SharedModule includes because we need to override AuthService
    beforeEach(() => {
        fixture = Core.createAppWithShared([AuthModule], [
            {
                path: 'auth/login',
                component: LoginComponent
            },
            {
                path: 'auth/forgot',
                component: ForgotPasswordComponent
            },
        ]);
        comp = fixture.componentInstance;
        comp.ngOnInit();
        router = fixture.debugElement.injector.get(Router);
        xhr = fixture.debugElement.injector.get(MockBackend);
        location = fixture.debugElement.injector.get(Location);
        forgotFixture = TestBed.createComponent(ForgotPasswordComponent);
        forgot = forgotFixture.componentInstance;
    });

    it('can be navigated to', (done) => {
        fixture.whenStable().then(() => {
            router.navigate(['/auth/forgot']).then(() => {
                expect(location.path()).toBe('/auth/forgot');
                done();
            });
        });
    });

    it('should show forgot password message', (done) => {
        forgot.email = 'megamindbrian@gmail.com';
        forgot.onNext();
        fixture.whenStable().then(() => {
            expect(location.path()).toContain('/auth/login');
            expect(location.path()).toContain('forgot=true');
            done();
        });
    });

});

