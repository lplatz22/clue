import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { USER_STATUS_CODES } from './user.service';
import { AuthenticationService } from '../authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	moduleId: module.id,
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['../app.component.css', './bootstrap-social.css']
})
export class LoginComponent implements OnInit {
	private error: string;
	private submitted: boolean = false;
	private returnUrl: string;

	private loginForm: FormGroup;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private authService: AuthenticationService,
		private fb: FormBuilder) {

		var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		this.loginForm = fb.group({
			'email': [null, Validators.compose([Validators.required, Validators.pattern(emailPattern)])],
			'password': [null, Validators.required],
		});
	}

	ngOnInit() {
		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
		this.authService.setLoggedIn(false);
		this.authService.setAdmin(false);
		this.authService.logout().subscribe(res => {
			console.log(res);
		}, error => {
			console.log(error);
		});
	}

	login(user: any) {
		this.submitted = true;
		this.error = null;

		this.authService.login(user).subscribe(user => {
			this.authService.setLoggedIn(true);
			this.authService.setAdmin(user.admin);
			this.router.navigate([this.returnUrl]);
		},
		error => {
			this.submitted = false;
			this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
		});
	}
}
