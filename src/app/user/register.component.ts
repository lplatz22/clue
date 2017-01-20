import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, USER_STATUS_CODES } from './user.service';

@Component({
  moduleId: module.id,
  selector: 'register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
	private newUser: any = {};
	private error: string;
	private submitted: boolean = false;

	constructor(private router: Router,
				private userService: UserService) {
	}

	ngOnInit() {
		
	}

	register() {
		this.submitted = true;
		this.error = null;
		this.userService.register(this.newUser).subscribe(data => {
				
				console.log('Registered!!');
				this.router.navigate(['/login']); //success
			},
			error => {
				this.submitted = false;
				this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
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
