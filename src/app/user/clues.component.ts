import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService, USER_STATUS_CODES } from '../user/user.service';

@Component({
	moduleId: module.id,
	selector: 'clues',
	templateUrl: './clues.component.html'
})
export class CluesComponent implements OnInit {
	private clues: any = [];
	private complete: boolean = false;
	private loading: boolean = false;
	private error: string;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private userService: UserService) {
	}

	ngOnInit() {
		this.loading = true;
		this.error = null;

		let id = +this.route.snapshot.params['task_id'];
		this.userService.getClues().subscribe(clues => {
			this.loading = false;
			this.clues = clues;
			console.log(this.clues);
		}, error => {
			this.loading = false;
			this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
		});
	}
}
