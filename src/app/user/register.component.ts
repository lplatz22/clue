import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  moduleId: module.id,
  selector: 'register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
	private newUser: any = {};
	private failMessage: string = '';

	constructor(private router: Router,
				private userService: UserService) {
	}

	ngOnInit() {
		
	}

	register() {
		this.userService.register(this.newUser).subscribe(response => {
			console.log(response);
			if(response.message == "ok"){
				this.failMessage = '';
			} else {
				this.failMessage = response.message;
			}
		});
	}

	passwordChange() {
		if(this.newUser.password === this.newUser.passwordConfirm){
			console.log('passwords match');
		} else {
			console.log('NO MATCH');
		}
	}
}
