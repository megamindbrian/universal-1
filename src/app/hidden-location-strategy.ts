import { APP_BASE_HREF, Location, LocationChangeListener, LocationStrategy, PlatformLocation } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';

export interface HistoryState {
    state: any;
    title: string;
    path: string;
}

@Injectable()
export class HiddenLocationStrategy extends LocationStrategy {
    private baseHref = '';
    private pathHistory: Array<HistoryState> = [];
    private poppedPathHistory: Array<HistoryState> = [];

    constructor(private platformLocation: PlatformLocation,
                @Optional() @Inject(APP_BASE_HREF) baseHref?: string) {
        super();

        if (typeof baseHref !== 'undefined') {
            this.baseHref = baseHref;
        }
    }

    onPopState(fn: LocationChangeListener): void {
        this.platformLocation.onPopState((ev: PopStateEvent) => {
            let backward = this.pathHistory.find((item) => item.state.uid === ev.state.uid);
            let forward = this.poppedPathHistory.find((item) => item.state.uid === ev.state.uid);

            if (backward) {
                this.navigateBack();
            } else if (forward) {
                this.navigateForward();
            }

            fn(ev);
        });
        // this.platformLocation.onHashChange(fn);
    }

    getBaseHref(): string {
        return this.baseHref;
    }

    path(): string {
        return this.pathHistory.length > 0
                ? this.pathHistory[ this.pathHistory.length - 1 ].path
                : '';
    }

    prepareExternalUrl(internal: string): string {
        return Location.joinWithSlash(this.baseHref, internal);
    }

    pushState(state: any, title: string, path: string, queryParams: string) {
        state = Object.assign({}, state, {
            uid: (new Date()).valueOf()
        });

        this.pathHistory.push({
            state: state,
            title: title,
            path: path
        });

        this.platformLocation.pushState(state, title, this.prepareExternalUrl(''));
    }

    replaceState(state: any, title: string, path: string, queryParams: string) {
        this.platformLocation.replaceState(state, title, path);
    }

    forward(): void {
        this.platformLocation.forward();
    }

    back(): void {
        this.platformLocation.back();
    }

    private navigateForward(): void {
        this.pathHistory.push(this.poppedPathHistory.pop());
    }

    private navigateBack(): void {
        this.poppedPathHistory.push(this.pathHistory.pop());
    }
}
