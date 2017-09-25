import { RouterModule, Routes } from '@angular/router';
import { Component, ModuleWithProviders, NgModule } from '@angular/core';
import { COMMON_MODULES } from '../../../imports/core.module';
import { AuthService } from '../../../imports/auth.service';

@Component({
    selector: 'bc-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {
    username: string;
    password: string;

    constructor(public service: AuthService) {
    }

    onLogin(): void {
        this.service.login(this.username, this.password).subscribe(r => {
            console.log(r);
        });
    }
}

export const COMPONENTS = [
    LoginComponent
];

export const authRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
        data: {roles: [ 'anonymous', 'user' ]}
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(authRoutes);

@NgModule({
    imports: [
        ...COMMON_MODULES,
        routing
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class AuthModule {
}
