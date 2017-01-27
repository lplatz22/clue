import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav.component.html'
})
export class NavComponent {
  public isCollapsed: boolean = true;
  private loggedIn: boolean = false;
  private isAdmin: boolean = false;
 
  constructor(private router: Router,
	  private authService: AuthenticationService) {
	this.router.events
	  .filter(event => event instanceof NavigationEnd)
	  .subscribe((event: NavigationEnd) => {
	    if(!this.isCollapsed){
	    	this.isCollapsed = true;
	    }
		this.loggedIn = this.authService.isLoggedIn();
		this.isAdmin = this.authService.isAdmin();
	  });
  }
}
