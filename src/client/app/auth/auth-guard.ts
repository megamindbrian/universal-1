import {Injectable} from '@angular/core';
import {
    Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild
} from '@angular/router';

// based on https://stackoverflow.com/a/39872345/8037972
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    redirect = false;

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean {
        const loggedIn = typeof localStorage.getItem('token') !== 'undefined';
        const userRoles = [loggedIn ? 'user' : 'anonymous'];
        const roles = <Array<string>>route.data['roles'] || <Array<string>>route.parent.data['roles'];
        const canActivate = (roles == null || userRoles.filter((r: string) => roles.indexOf(r) !== -1).length > 0);
        if (this.redirect) {
            return canActivate;
        }
        this.redirect = true;
        if (!canActivate) {
            // if (loggedIn) could be used to set a different 401 Unauthorized page
            // TODO: you must login first message?
            // redirect unauthorized routes to home page
            this.router.navigate(['/']);
        }
        return canActivate;
    }

    canActivateChild(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot) {
        return this.canActivate(route, state);
    }

}
