import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, USER_STATUS_CODES } from './user.service';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['../app.component.css']
})
export class RegisterComponent implements OnInit {
	private error: string;
	private submitted: boolean = false;

	private registerForm: FormGroup;

	constructor(private router: Router,
				private userService: UserService,
				private fb: FormBuilder) {
		var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		this.registerForm = fb.group({
			// To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
			'firstName': [null, Validators.required],
			// We can use more than one validator per field. If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
			'lastName': [null, Validators.compose([Validators.required])],
			'email': [null, Validators.compose([Validators.required, Validators.pattern(emailPattern)])],
			'password': [null, Validators.required],
			'passwordConfirm': [null, Validators.required],
			'company': [null, Validators.required]
		}, { validator: matchingPasswords('password', 'passwordConfirm') });
	}

	ngOnInit() {
		
	}

	register(newUser: any) {

		this.submitted = true;
		this.error = null;
		this.userService.register(newUser).subscribe(data => {
				
				console.log('Registered!!');
				this.router.navigate(['/login']); //success
			},
			error => {
				this.submitted = false;
				this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
			});
	}
}

// FORM GROUP VALIDATORS
export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
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
