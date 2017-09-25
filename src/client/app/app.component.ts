// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';

// libs
import { ConfigService } from '@ngx-config/core';
import { MetaService } from '@ngx-meta/core';
// import { I18NRouterService } from '@ngx-i18n-router/core';
import { TranslateService } from '@ngx-translate/core';

// external styles
import '../assets/sass/layout.scss';
import * as key from 'keymaster';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'app-root',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnDestroy {
    @HostBinding('class.expanded') expanded = false;
    title: string;
    routerSub: Subscription;

    constructor(public config: ConfigService,
                public translate: TranslateService,
                public meta: MetaService,
                public router: Router,
                public ref: ChangeDetectorRef) { // ,
        // private readonly i18nRouter: I18NRouterService) {
    }

    ngOnInit(): void {
        this.routerSub = this.router.events
                .filter(e => e instanceof NavigationEnd)
                .subscribe(e => {
                    this.expanded = true;
                    this.ref.detectChanges();
                });

        this.title = 'ng-seed (universal) works!';

        key('⌘+f, alt+f', () => {
            this.router.navigate([ '/search' ]);
        });
        key('⌘+r, alt+r', () => {
            this.router.navigate([ '/recording' ]);
        });
    }

    ngOnDestroy(): void {
        if (typeof this.routerSub !== 'undefined') {
            this.routerSub.unsubscribe();
        }
    }

    getNextRoute(): string {
        const paths = this.router.config[ 0 ].children.map(r => r.path);
        const i = paths.indexOf(this.router.url.split('/')[ 1 ]);

        return paths[ i === paths.length - 1 ? 0 : (i + 1) ];
    }

    private setLanguage(language: any): void {
        this.translate.use(language.code).subscribe(() => {
            this.meta.setTag('og:locale', language.culture);
        });

        // this.i18nRouter.changeLanguage(language.code);
    }

}
