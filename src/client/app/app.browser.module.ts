// angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// libs
import { BrowserStateTransferModule, DEFAULT_STATE_ID } from '@ngx-universal/state-transfer';
import { CACHE } from '@ngx-cache/core';
import { BrowserCacheModule, MemoryCacheService, STATE_ID } from '@ngx-cache/platform-browser';

// modules & components
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlatformLocation } from '@angular/common';
import { MockPlatformLocation } from '../../imports/location.service';

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
            }
        ]),
        AppModule
    ],
    providers: [
        {
            provide: PlatformLocation,
            useClass: MockPlatformLocation,
            deps: []
        }
    ]
})
export class AppBrowserModule {
}
