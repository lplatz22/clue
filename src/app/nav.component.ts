import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav.component.html'
})
export class NavComponent {
  public isCollapsed: boolean = true;
 
  constructor(private router: Router) {
	this.router.events
	  .filter(event => event instanceof NavigationEnd)
	  .subscribe((event: NavigationEnd) => {
	    if(!this.isCollapsed){
	    	this.isCollapsed = true;
	    }
	  });
  }
}
