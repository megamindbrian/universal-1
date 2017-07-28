import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'bc-forgot',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
    email: string;
    error = '';

    constructor(public auth: AuthService,
                public router: Router) {
    }

    onNext() {
        if (this.email === '') {
            return;
        }
        this.auth.forgotPassword(this.email).subscribe(response => {
            if (response.ok) {
                this.router.navigate(['/auth/login', {forgot: true}]);
            } else {
                this.error = response.statusText;
            }
        });
    }

}

