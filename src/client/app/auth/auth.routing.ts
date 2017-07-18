import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const authRoutes: Routes = [
    /*
     {
     path: 'logout',
     component: LogoutComponent,
     data: {roles: ['anonymous', 'user']}
     },
     */
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: LoginComponent,
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(authRoutes);

