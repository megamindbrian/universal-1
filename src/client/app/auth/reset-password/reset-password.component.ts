import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../imports/environment';
import { Http, Request, Headers } from '@angular/http';
import { AuthService } from '../auth.service';

@Component({
    selector: 'bc-reset',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

    verificationCode: string;
    email: string;
    password: string;
    code: string;
    error = '';

    constructor(public router: Router,
                public auth: AuthService,
                public route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            this.email = params['email'];
        });
        this.route.queryParams.subscribe(params => {
            this.code = params['code'];
        });
    }

    onNext() {
        this.auth.passwordReset(this.email, this.code, this.password)
            .subscribe(response => {
                if (response.ok) {
                    this.router.navigate(['/']);
                } else {
                    this.error = response.statusText;
                }
            });
    }

}

