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
import { AuthService } from './auth/auth.service';
import { PlatformLocation } from '@angular/common';
import { LogService } from '../../imports/log.service';
import { AuthManager } from './auth/auth.manager';
import { JwtHelper } from 'angular2-jwt/angular2-jwt';
import { MailgunValidatorService } from './auth/mailgun-validate.service';
import { Http } from '@angular/http';
;

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
    providers: [ AuthManager, JwtHelper, MailgunValidatorService,
        {
            provide: AuthService,
            useFactory: (http: Http,
                         log: LogService,
                         authManager: AuthManager,
                         mailgun: MailgunValidatorService) => require('./sockify-client')
                .sockifyClient(new AuthService(http, log, authManager, mailgun), 'AuthService'),
            deps: [ Http, LogService, AuthManager, MailgunValidatorService ]
        },
        {
            provide: LogService,
            useValue: require('./sockify-client').sockifyClient(new LogService(), 'LogService')
        }
    ]
})
export class AppBrowserModule {
}
