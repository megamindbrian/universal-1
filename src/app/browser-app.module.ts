import { LocationStrategy, PlatformLocation } from '@angular/common';
// angular
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CACHE } from '@ngx-cache/core';
import { BrowserCacheModule, MemoryCacheService, STATE_ID } from '@ngx-cache/platform-browser';
// libs
import { BrowserStateTransferModule, DEFAULT_STATE_ID } from '@ngx-universal/state-transfer';
import { SharedModule } from '../imports/core.module';
import { MockPlatformLocation } from '../imports/location.service';
import { SearchService } from '../imports/search.service';
import { sockifyClient } from '../imports/sockify-client.js';
import { AppComponent } from './app.component';
// modules & components
import { AppModule } from './app.module';
import { HiddenLocationStrategy } from './hidden-location-strategy';

export function searchClientFactory(http: Http): SearchService {
    return new (sockifyClient(
            SearchService,
            'SearchService',
            (window as any).SOCKIFY_SERVER || 'https://localhost:8000'))(http);
}

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule.withServerTransition({
            appId: 'my-app-id'
        }),
        BrowserStateTransferModule.forRoot(),
        BrowserCacheModule.forRoot([
            {
                provide: CACHE,
                useClass: MemoryCacheService
            },
            {
                provide: STATE_ID,
                useValue: DEFAULT_STATE_ID
            },
            {
                provide: LocationStrategy,
                useClass: HiddenLocationStrategy
            }
        ]),
        SharedModule.forRoot(),
        AppModule
    ],
    providers: [
        {
            provide: PlatformLocation,
            useClass: MockPlatformLocation,
            deps: []
        },
        {
            provide: SearchService,
            useFactory: searchClientFactory,
            deps: [ Http ]
        }
    ]
})
export class BrowserAppModule {
}
