import {Component, Input} from '@angular/core';
import {RegistrationUser} from './register-user';

/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({
    selector: 'bc-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
    @Input() public registrationUser: RegistrationUser;
    @Input() public hideEmail = false;

    constructor() {
        this.onInit();
    }

    onInit() {
    }
}


