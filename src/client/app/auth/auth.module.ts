import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterFormComponent } from './register-form/register-form.component';

import { routing } from './auth.routing';

import { COMMON_MODULES } from '../core.module';

export const COMPONENTS = [
    LoginComponent,
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
