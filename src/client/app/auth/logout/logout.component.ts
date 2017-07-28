import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
    selector: 'bc-logout',
    template: ''
})
export class LogoutComponent implements OnInit {

    constructor(
        public router: Router,
        public authService: AuthService) {
    }

    ngOnInit() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

}

