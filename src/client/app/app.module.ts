// angular
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// libs
import { HttpTransferModule } from '@ngx-universal/state-transfer';
import { CacheModule } from '@ngx-cache/core';
import { ConfigLoader, ConfigModule, ConfigService } from '@ngx-config/core';
import { UniversalConfigLoader } from '@ngx-universal/config-loader';
import { MetaLoader, MetaModule, MetaStaticLoader } from '@ngx-meta/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

// routes & components
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { ChangeLanguageComponent } from './change-language.component';
import { SharedModule, sharedModules } from './core.module';
import { Observable } from 'rxjs/Observable';
import { ConfigFsLoader } from '@ngx-config/fs-loader';

// for AoT compilation
export function configFactory(platformId: any, http: Http): ConfigLoader {
    const browserLoader = <ConfigLoader>{
        loadSettings: () => Promise.resolve(
            (typeof window !== 'undefined' ? <any>window : {}).CONFIG
            || {})
    };
    const serverLoader = new ConfigFsLoader('./public/assets/config.json');
    return new UniversalConfigLoader(platformId, serverLoader, browserLoader);
}

export function metaFactory(config: ConfigService, translate: TranslateService): MetaLoader {
    try {
        return new MetaStaticLoader({
            callback: (key: string) => translate.get(key),
            pageTitlePositioning: config.getSettings('seo.pageTitlePositioning'),
            pageTitleSeparator: config.getSettings('seo.pageTitleSeparator'),
            applicationName: config.getSettings('system.applicationName'),
            applicationUrl: config.getSettings('system.applicationUrl'),
            defaults: {
                title: config.getSettings('seo.defaultPageTitle'),
                description: config.getSettings('seo.defaultMetaDescription'),
                generator: 'ng-seed',
                'og:site_name': config.getSettings('system.applicationName'),
                'og:type': 'website',
                'og:locale': config.getSettings('i18n.defaultLanguage.culture'),
                'og:locale:alternate': config.getSettings('i18n.availableLanguages')
                    .map((language: any) => language.culture).toString()
            }
        });
    } catch (e) {
        console.log(e);
        return new MetaStaticLoader();
    }
}

export function translateFactory(platformId: any, http: Http): TranslateLoader {
    return <TranslateLoader>{
        getTranslation: lang => Observable.of(
            (typeof window !== 'undefined' ? <any>window : {}).TRANSLATIONS)
    };
}

@NgModule({
    imports: [
        BrowserModule,
        HttpTransferModule.forRoot(),
        RouterModule.forRoot(routes, {initialNavigation: 'enabled', useHash: false}),
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
        }),

        SharedModule.forRoot(),
        ...sharedModules,
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

