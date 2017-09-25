// angular
import { RouterModule, Routes } from '@angular/router';

// libs
import { MetaGuard } from '@ngx-meta/core';

// components
import { ChangeLanguageComponent } from './change-language.component';
import { ModuleWithProviders } from '@angular/core';

export const appRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'search',
                loadChildren: './components/search.module#SearchModule'
            },
            {
                path: 'recording',
                loadChildren: './components/recording.module#RecordingModule'
            }
        ],
        canActivateChild: [ MetaGuard ],
        data: {
            i18n: {
                isRoot: true
            }
        }
    },
    {
        path: 'change-language/:languageCode',
        component: ChangeLanguageComponent
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
export const routing: ModuleWithProviders = RouterModule.forRoot(
        appRoutes,
        {initialNavigation: 'enabled', useHash: false});
