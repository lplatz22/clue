import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';


@Injectable()
export class RoutingGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) {}
  
  canActivate(): Observable<boolean> | boolean {
    return this.userService.authenticated()
      .map(
        result => {
          console.log(result);
          if (result.authenticated) {
            return true;
          } else {
            this.router.navigate(['login']);
            return false;
          }
        }
      ).catch(error => {
        this.router.navigate(['login']);
        return Observable.of(false);
      });
  }
}