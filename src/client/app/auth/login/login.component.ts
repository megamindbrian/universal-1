import 'rxjs/add/operator/let';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from './auth-user';
import { animate, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/observable/timer';
import { RegistrationUser } from '../register-form/register-user';
import { MD_DIALOG_DATA, MdDialog } from '@angular/material';

@Component({
    selector: 'bc-login-page',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ],
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
export class LoginComponent implements AfterViewInit {
    public authUser = new AuthUser('', '');
    public message: string;
    public isLogin = false;
    public isRegister = false;
    public emailChanged = new EventEmitter();
    public registrationUser: RegistrationUser = new RegistrationUser();

    constructor(public router: Router,
                public ref: ChangeDetectorRef,
                public dialog: MdDialog,
                @Optional() @Inject(MD_DIALOG_DATA) public data: any = void 0) {
    }

    ngAfterViewInit() {
        this.emailChanged
            .debounce(() => Observable.timer(300))
            .subscribe(() => this.checkUsername());
        if (typeof this.data !== 'undefined') {
            this.checkUsername();
        }
    }

    onRegister() {
        delete this.message;
        if (this.authUser.name !== '') {
            this.registrationUser.email = this.authUser.name;
        }
        if (this.registrationUser.firstName === '' || this.registrationUser.lastName === ''
            || this.registrationUser.email === '' || this.registrationUser.password === '') {
            this.communicateError('INCOMPLETE');
            return;
        }

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
        if (this.authUser.name === '' || this.authUser.password === '') {
            this.communicateError('INCOMPLETE');
            return;
        }

    }

    private communicateError(msg: string): void {
        this.message = msg;
        this.ref.detectChanges();
    }

}


