import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LogoutComponent } from './logout/logout.component';

export const authRoutes: Routes = [
    {
        path: 'logout',
        component: LogoutComponent,
        data: {roles: [ 'anonymous', 'user' ]}
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: LoginComponent
    },
    {
        path: 'reset/:email',
        component: ResetPasswordComponent
    },
    {
        path: 'forgot',
        component: ForgotPasswordComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(authRoutes);

