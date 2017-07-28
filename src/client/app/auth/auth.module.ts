import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LogoutComponent } from './logout/logout.component';

import { routing } from './auth.routing';
import { COMMON_MODULES } from '../../../imports/core.module';

export const COMPONENTS = [
    LoginComponent,
    LogoutComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    RegisterFormComponent
];

@NgModule({
    imports: [
        ...COMMON_MODULES,
        routing
    ],
    providers: [],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class AuthModule {
}

