import { ResultComponent } from './result.component';
import { SearchComponent } from './search.component';
import { ResultsListComponent } from './results-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { COMMON_MODULES } from '../../imports/core.module';

export const COMPONENTS = [
    SearchComponent,
    ResultComponent,
    ResultsListComponent
];

export const searchRoutes: Routes = [
    {
        path: '',
        component: SearchComponent,
        data: {roles: [ 'anonymous', 'user' ]}
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(searchRoutes);

@NgModule({
    imports: [
        ...COMMON_MODULES,
        routing
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class SearchModule {
}
