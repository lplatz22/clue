import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';


@Injectable()
export class RoutingGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.authenticated()
      .map(
        result => {
          if (result.authenticated) {
            this.authService.setLoggedIn(true);
            this.authService.setAdmin(result.admin);
            return true;
          } else {
            this.authService.setLoggedIn(false);
            this.authService.setAdmin(false);
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
            return false;
          }
        }
      ).catch(error => {
        this.authService.setLoggedIn(false);
        this.authService.setAdmin(false);
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        return Observable.of(false);
      });
  }
}

@Injectable()
export class AdminRoutingGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authService.authenticated()
      .map(
      result => {
        if (result.authenticated && result.admin) {
          this.authService.setLoggedIn(true);
          this.authService.setAdmin(result.admin);
          return true;
        } else if (result.authenticated && !result.admin) {
          this.authService.setLoggedIn(true);
          this.authService.setAdmin(false);
          this.router.navigate(['tasks']);
          return true;
        } else {
          this.authService.setLoggedIn(false);
          this.authService.setAdmin(false);
          this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      }
      ).catch(error => {
        this.authService.setLoggedIn(false);
        this.authService.setAdmin(false);
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        return Observable.of(false);
      });
  }
}