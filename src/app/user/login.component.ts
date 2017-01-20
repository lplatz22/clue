import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { USER_STATUS_CODES } from './user.service';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
	private user: any = {};
	private error: string;
	private submitted: boolean = false;

	constructor(private router: Router,
				private userService: UserService) {
	}

	ngOnInit() {
		
	}

	login() {
		this.submitted = true;
		this.error = null;

		this.userService.login(this.user).subscribe(data => {
				
				console.log('logged in!!');
				// this.submitted = false;
				this.router.navigate(['/tasks']); //success
			},
			error => {
				this.submitted = false;
				this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
			});
	}
}
