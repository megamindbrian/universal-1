import {ComponentFixture, TestBed} from '@angular/core/testing';
import {} from 'jasmine';
import {MockBackend} from '@angular/http/testing';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Core} from '../../../testing/core';
import {LoginComponent} from '../login/login.component';
import {SharedModule} from "../../core/core.module";

describe('RegisterComponent', function () {
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
    });

    it('should create RegisterFormComponent', (done) => {
        fixture.whenStable().then(() => {
            expect(comp).not.toBeNull('should be created successfully');
            done();
        });
    });

    it('onRegister() should show done message', (done) => {
        const navigateSpy = spyOn((<any>comp).router, 'navigate');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            comp.onRegister();
            expect(navigateSpy).toHaveBeenCalledTimes(0);

            comp.registrationUser['email'] = ('megamindbrian@gmail.com');
            comp.registrationUser['firstName'] = ('Brian');
            comp.registrationUser['lastName'] = ('C');
            comp.registrationUser['password'] = ('tEst12345!');
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                comp.onRegister();
                expect(comp.message).toBeUndefined();
                expect(navigateSpy).toHaveBeenCalledWith(['/']);
                done();
            });
        });
    });
});

