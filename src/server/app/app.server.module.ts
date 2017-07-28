// angular
import { NgModule, APP_BOOTSTRAP_LISTENER, ApplicationRef, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { Subscription } from 'rxjs/Subscription';

// libs
import { ServerStateTransferModule, StateTransferService } from '@ngx-universal/state-transfer';
import { CACHE, CacheService, STORAGE } from '@ngx-cache/core';
import { FsCacheService, ServerCacheModule } from '@ngx-cache/platform-server';
import { fsStorageFactory, FsStorageLoader, FsStorageService } from '@ngx-cache/fs-storage';

// modules & components
import { AppModule } from '../../client/app/app.module';
import { AppComponent } from '../../client/app/app.component';
import { AuthService } from '../../client/app/auth/auth.service';
import { LogService } from '../../imports/log.service';
import { AuthManager } from '../../client/app/auth/auth.manager';
import { JwtHelper } from 'angular2-jwt/angular2-jwt';
import { MailgunValidatorService } from '../../client/app/auth/mailgun-validate.service';
import { Http } from '@angular/http';

export const LocalStorage = new InjectionToken<any>('localStorage');

export function bootstrapFactory(appRef: ApplicationRef,
                                 stateTransfer: StateTransferService,
                                 cache: CacheService): () => Subscription {
    console.log('bootstrapFactory');
    return () => appRef.isStable
        .filter((stable) => stable)
        .first()
        .subscribe(() => {
            stateTransfer.set(cache.key, JSON.stringify(cache.dehydrate()));
            stateTransfer.inject();
        });
}

export function createAuthService(http: Http,
                                  log: LogService,
                                  authManager: AuthManager,
                                  mailgun: MailgunValidatorService): AuthService {
    return require('../sockify-server')
        .sockifyRequire(new AuthService(http, log, authManager, mailgun), 'AuthService');
}

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
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
        AppModule
    ],
    providers: [
        {
            provide: AuthService,
            useFactory: createAuthService,
            deps: [ Http, LogService, AuthManager, MailgunValidatorService ]
        },
        {
            provide: LogService,
            useValue: require('../sockify-server').sockifyRequire(new LogService(), 'LogService')
        },
        AuthManager, JwtHelper, MailgunValidatorService,
        {
            provide: LocalStorage,
            useValue: {
                getItem(): any {
                    /*  */
                }
            }
        },
        {
            provide: APP_BOOTSTRAP_LISTENER,
            useFactory: bootstrapFactory,
            multi: true,
            deps: [
                ApplicationRef,
                StateTransferService,
                CacheService
            ]
        }
    ]
})
export class AppServerModule {
}
