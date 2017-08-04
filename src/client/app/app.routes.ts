// angular
import { Routes } from '@angular/router';

// libs
import { MetaGuard } from '@ngx-meta/core';

// components
import { ChangeLanguageComponent } from './change-language.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'search',
                loadChildren: './components/search.component#SearchModule'
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
