import { PlatformLocation } from '@angular/common';
export class MockPlatformLocation implements PlatformLocation {
    public pathname = '';
    public search = '';
    public hash = '';
    readonly location: Location;

    constructor() {
        this.pathname = (<any>window).INITIAL_PATH || window.location.pathname || '/';
        this.location = Object.assign({}, window.location);
        this.location.pathname = this.pathname;
    }

    getBaseHrefFromDOM() {
        return '/';
    }

    onPopState() {
        return this;
    };

    onHashChange() {
    };

    replaceState(state: any, title: string, url: string) {
        this.location.pathname = url;
        this.pathname = url;
    };

    pushState(state: any, title: string, url: string) {
        this.location.pathname = url;
        this.pathname = url;
    };

    forward() {
    };

    back() {
    };
}
