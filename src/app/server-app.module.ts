// angular
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';
import { CACHE, CacheService, STORAGE } from '@ngx-cache/core';
import { fsStorageFactory, FsStorageLoader, FsStorageService } from '@ngx-cache/fs-storage';
import { FsCacheService, ServerCacheModule } from '@ngx-cache/platform-server';
// libs
import { ServerStateTransferModule, StateTransferService } from '@ngx-universal/state-transfer';
import { SharedModule } from '../imports/core.module';
import { AppComponent } from './app.component';
// modules & components
import { AppModule } from './app.module';

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        NoopAnimationsModule,
        BrowserModule.withServerTransition({
            appId: 'my-app-id'
        }),
        ServerModule,
        ServerStateTransferModule.forRoot(),
        ServerCacheModule.forRoot([
            {
                provide: CACHE,
                useClass: FsCacheService
            },
            {
                provide: STORAGE,
                useClass: FsStorageService
            },
            {
                provide: FsStorageLoader,
                useFactory: fsStorageFactory
            }
        ]),
        SharedModule.forRoot(),
        AppModule
    ]
})
export class ServerAppModule {
    constructor(private readonly stateTransfer: StateTransferService,
                private readonly cache: CacheService) {
    }

    ngOnBootstrap = () => {
        this.stateTransfer.set(this.cache.key, JSON.stringify(this.cache.dehydrate()));
        this.stateTransfer.inject();
    };
}
