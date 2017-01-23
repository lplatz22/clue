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
            return true;
          } else {
            this.authService.setLoggedIn(false);
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
            return false;
          }
        }
      ).catch(error => {
        this.authService.setLoggedIn(false);
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        return Observable.of(false);
      });
  }
}