import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
	private user: any = {};
	private failMessage: string = '';

	constructor(private router: Router,
				private userService: UserService) {
	}

	ngOnInit() {
		
	}

	login() {
		console.log(this.user);
		//this.user.email
		//this.user.password
		this.userService.login(this.user).subscribe(response => {
			console.log(response);
			if(response.message == "ok"){
				this.failMessage = '';
			} else {
				this.failMessage = response.message;
			}
		});
	}
}
