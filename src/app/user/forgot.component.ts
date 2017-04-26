import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { USER_STATUS_CODES } from './user.service';
import { AuthenticationService } from '../authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	moduleId: module.id,
	selector: 'forgot',
	templateUrl: './forgot.component.html',
	styleUrls: ['../app.component.css', './bootstrap-social.css']
})
export class ForgotComponent implements OnInit {
	private error: string;
	private submitted: boolean = false;
	private emailSent: string = '';

	private forgotForm: FormGroup;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private authService: AuthenticationService,
		private fb: FormBuilder) {

		var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		this.forgotForm = fb.group({
			'email': [null, Validators.compose([Validators.required, Validators.pattern(emailPattern)])]
		});
	}

	ngOnInit() {
	}

	forgot(user: any) {
		this.submitted = true;
		this.error = null;
		this.emailSent = '';

		this.authService.forgot(user).subscribe(user => {
			this.submitted = false;
			this.emailSent = JSON.parse(user._body).email;
			// this.authService.setLoggedIn(true);
			// this.authService.setAdmin(user.admin);
			// this.router.navigate([this.returnUrl]);
		},
		error => {
			console.log(error);
			this.submitted = false;
			this.error = error._body;
		});
	}
}
