import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: './home.component.html',
  // styleUrls: ['./app.component.css']
})
export class HomeComponent {

	constructor(private router: Router) {
		
	}
}
