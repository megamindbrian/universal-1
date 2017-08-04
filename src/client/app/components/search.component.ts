import { Injectable } from '@angular/core';
import { Component, ModuleWithProviders, NgModule } from '@angular/core';
import { COMMON_MODULES } from '../../../imports/core.module';
import { Observable } from 'rxjs/Observable';
import { RouterModule, Routes } from '@angular/router';
import { Http, Response } from '@angular/http';

export let callbackUrl = 'localhost';

@Injectable()
export class SearchService {
    constructor(public http: Http) {
    }

    search(query: string): Observable<Response> {
        return this.http.post(callbackUrl, {query});
    }
}

@Component({
    selector: 'bc-search',
    template: `
        <form>
            <md-input-container>
                <input mdInput name="search" required type="text"
                       placeholder="Search"
                       maxlength="100" [(ngModel)]="query" (change)="search()">
            </md-input-container>
        </form>
    `,
    styles: [ `
    ` ]
})
export class SearchComponent {
    query = '';

    constructor(public service: SearchService) {
    }

    search(): void {
        this.service.search(this.query);
    }
}

export const COMPONENTS = [
    SearchComponent
];

export const authRoutes: Routes = [
    {
        path: '',
        component: SearchComponent,
        data: {roles: [ 'anonymous', 'user' ]}
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(authRoutes);

@NgModule({
    imports: [
        ...COMMON_MODULES,
        routing
    ],
    providers: [],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class SearchModule {
}

