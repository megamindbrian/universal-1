import 'rxjs/add/operator/let';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthUser } from './auth-user';
import { animate, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { RegistrationUser } from '../register-form/register-user';
import { MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'bc-login-page',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [
        trigger('dialog', [
            transition('void => *', [
                style({transform: 'scale3d(.3, .3, .3)'}),
                animate(200)
            ]),
            transition('* => void', [
                animate(200, style({transform: 'scale3d(0, 0, 0)'}))
            ])
        ])
    ]
})
export class LoginComponent implements AfterViewInit, OnDestroy {
    sub: Subscription;
    public authUser = new AuthUser('', '');
    public message: string;
    public isLogin = false;
    public isRegister = false;
    public emailChanged = new EventEmitter();
    public registrationUser: RegistrationUser = new RegistrationUser();

    constructor(public router: Router,
                public ref: ChangeDetectorRef,
                public dialog: MdDialog,
                public auth: AuthService,
                @Optional() @Inject(MD_DIALOG_DATA) public data: any = null) {
    }

    ngAfterViewInit() {
        if (this.router.url.indexOf('forgot') > -1) {
            this.communicateError('FORGOT');
        }
        this.sub = this.emailChanged
            .debounce(() => Observable.timer(300))
            .subscribe(() => this.checkUsername());
        if (typeof this.data !== 'undefined') {
            this.checkUsername();
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onRegister() {
        delete this.message;
        this.ref.detectChanges();
        if (this.authUser.name !== '') {
            this.registrationUser.email = this.authUser.name;
        }
        if (this.registrationUser.firstName === '' || this.registrationUser.lastName === ''
            || this.registrationUser.email === '' || this.registrationUser.password === ''
            || this.registrationUser.phoneNumber === '' || this.registrationUser.companyName === '') {
            this.communicateError('INCOMPLETE');
            return;
        }
        this.auth.register(this.registrationUser)
            .flatMap(() => this.auth.login(new AuthUser(
                this.registrationUser.email,
                this.registrationUser.password)))
            .catch(e => {
                this.communicateError('REGISTERERROR');
                return Observable.throw(e);
            })
            .subscribe(response => {
                if (response) {
                    this.dialog.closeAll();
                    this.router.navigate(['/']);
                }
            }, err => {
                if (typeof err.json === 'function'
                    && typeof err.json().is_valid !== 'undefined' && !err.json().is_valid) {
                    this.communicateError('EMAIL');
                } else if (typeof err.json === 'function'
                    && err.json().Message.match('already')) {
                    this.communicateError('ALREADY');
                    this.router.navigate(['login']);
                } else if (('' + err).indexOf('Password') > -1) {
                    this.communicateError('PASSWORD');
                } else {
                    this.communicateError('REGISTERERROR');
                }
            });
    }

    checkUsername() {
        const url = typeof this.data !== 'undefined' && this.data !== null
            ? this.data.url.join('/')
            : this.router.url;
        if (url.indexOf('register') > -1) {
            this.isRegister = true;
        } else {
            if (this.authUser.name !== '' || url.indexOf('login') > -1) {
                this.isLogin = true;
            } else {
                this.isLogin = false;
                this.isRegister = false;
            }
        }
        this.ref.detectChanges();
    }

    onLogin(): void {
        delete this.message;
        this.ref.detectChanges();
        if (this.authUser.name === '' || this.authUser.password === '') {
            this.communicateError('INCOMPLETE');
            return;
        }
        this.auth.login(this.authUser)
            .subscribe(isSuccess => {
                if (isSuccess) {
                    this.dialog.closeAll();
                    this.router.navigate(['/']);
                }
            }, err => {
                if (typeof err.json() !== 'undefined'
                    && err.json().error.indexOf('invalid_grant')) {
                    this.communicateError('INCORRECT');
                } else {
                    this.communicateError('ERROR');
                }
            });
    }

    private communicateError(msg: string): void {
        this.message = msg;
        this.ref.detectChanges();
    }

}


