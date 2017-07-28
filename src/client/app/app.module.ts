// angular
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
// import { RouterModule, Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

// libs
import { HttpTransferModule } from '@ngx-universal/state-transfer';
import { CacheModule } from '@ngx-cache/core';
import { ConfigLoader, ConfigModule, ConfigService } from '@ngx-config/core';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { ConfigFsLoader } from '@ngx-config/fs-loader';
import { UniversalConfigLoader } from '@ngx-universal/config-loader';
import { UniversalTranslateLoader } from '@ngx-universal/translate-loader';
import { MetaLoader, MetaModule, MetaStaticLoader } from '@ngx-meta/core';
// import { I18N_ROUTER_PROVIDERS, I18NRouterLoader, I18NRouterModule, RAW_ROUTES } from '@ngx-i18n-router/core';
// import { I18NRouterConfigLoader } from '@ngx-i18n-router/config-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// routes & components
import { routes } from './app.routes';
;
import { AppComponent } from './app.component';
import { SharedModule, sharedModules } from '../../imports/core.module';
import { Observable } from 'rxjs/Observable';
;
import { ChangeLanguageComponent } from './change-language.component';

// for AoT compilation
export function configFactory(platformId: any, http: Http): ConfigLoader {
    const serverLoader = new ConfigFsLoader('./public/assets/config.json');

    const browserLoader = {
        loadSettings: () => Promise.resolve(
            (typeof window !== 'undefined' ? window as any : {}).CONFIG
            || {})
    } as ConfigHttpLoader;
    ;

    return new UniversalConfigLoader(platformId, serverLoader, browserLoader);
}

export function metaFactory(config: ConfigService, translate: TranslateService): MetaLoader {
    return new MetaStaticLoader();

}

export function translateFactory(platformId: any, http: Http): TranslateLoader {
    return {
        getTranslation: lang => Observable.of(
            (typeof window !== 'undefined' ? <any>window : {}).TRANSLATIONS)
    } as TranslateLoader;
}

@NgModule({
    imports: [
        BrowserModule,
        HttpTransferModule.forRoot(),

        RouterModule.forRoot(routes, {initialNavigation: 'enabled', useHash: false})
        ,
        HttpModule,
        CacheModule.forRoot(),
        ConfigModule.forRoot({
            provide: ConfigLoader,
            useFactory: (configFactory),
            deps: [ PLATFORM_ID, Http ]
        }),
        MetaModule.forRoot({
            provide: MetaLoader,
            useFactory: (metaFactory),
            deps: [ ConfigService, TranslateService ]
        }),
        // I18NRouterModule.forRoot(routes, [
        //   {
        //     provide: I18NRouterLoader,
        //     useFactory: (i18nRouterFactory),
        //     deps: [ConfigService, RAW_ROUTES]
        //   }
        // ]),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (translateFactory),
                deps: [ PLATFORM_ID, Http ]
            }
        })
    ],
    // providers: [
    //   I18N_ROUTER_PROVIDERS
    // ],
    declarations: [
        AppComponent,
        ChangeLanguageComponent
    ],
    exports: [ AppComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
    constructor(@Inject(PLATFORM_ID) private readonly platformId: any) {
    }
}
