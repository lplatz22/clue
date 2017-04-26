import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { USER_STATUS_CODES } from './user.service';
import { AuthenticationService } from '../authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	moduleId: module.id,
	selector: 'reset',
	templateUrl: './reset.component.html',
	styleUrls: ['../app.component.css', './bootstrap-social.css']
})
export class ResetComponent implements OnInit {
	private error: string;
	private submitted: boolean = false;
	private resetSuccess: boolean = false;
	private emailSent: string = '';
	private token: string = '';

	private resetForm: FormGroup;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private authService: AuthenticationService,
		private fb: FormBuilder) {

		this.resetForm = fb.group({
			'password': [null, Validators.required],
			'passwordConfirm': [null, Validators.required],
		}, { validator: matchingPasswordsReset('password', 'passwordConfirm') });
	}

	ngOnInit() {
		this.token = this.route.snapshot.params['token'];
		console.log('token:',this.token);
	}

	resetPassword(user: any) {
		console.log(user);
		user.token = this.token;

		this.submitted = true;
		this.error = null;

		this.authService.resetPassword(user).subscribe(user => {
			this.submitted = false;
			this.resetSuccess = true;
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

export function matchingPasswordsReset(passwordKey: string, confirmPasswordKey: string) {
	return (group: FormGroup): { [key: string]: any } => {
		let password = group.controls[passwordKey];
		let confirmPassword = group.controls[confirmPasswordKey];

		if (password.value !== confirmPassword.value) {
			return {
				mismatchedPasswords: true
			};
		}
	}
}
