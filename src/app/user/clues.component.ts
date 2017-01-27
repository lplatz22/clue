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
	private locations: any = [];
	private weapons: any = [];
	private suspects: any = [];
	private clueNames: any = [];

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
		this.userService.getClues().subscribe(result => {
			this.loading = false;
			this.clues = result.clues;
			this.suspects = result.suspects;
			this.weapons = result.weapons;
			this.locations = result.locations;

			for (var c in this.clues) {
				this.clueNames.push(this.clues[c].clue);
			}
		}, error => {
			this.loading = false;
			this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
		});
	}

	check(clue){
		for(var c in this.clueNames) {
			if(this.clueNames[c] == clue){
				return true;
			}
		}
		return false;
	}
}
