import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { USER_STATUS_CODES } from './user.service';
import { AuthenticationService } from '../authentication.service';

@Component({
	moduleId: module.id,
	selector: 'login',
	templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
	private user: any = {};
	private error: string;
	private submitted: boolean = false;
	private returnUrl: string;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private authService: AuthenticationService) {
	}

	ngOnInit() {
		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
		this.authService.setLoggedIn(false);

		this.authService.logout().subscribe(res => {
			console.log(res);
		}, error => {
			console.log(error);
		});
	}

	login() {
		this.submitted = true;
		this.error = null;

		this.authService.login(this.user).subscribe(user => {
			this.authService.setLoggedIn(true);
			this.router.navigate([this.returnUrl]);
		},
		error => {
			this.submitted = false;
			this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
		});
	}
}
