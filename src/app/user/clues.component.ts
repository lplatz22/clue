import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { UserService, USER_STATUS_CODES } from '../user/user.service';

@Component({
	moduleId: module.id,
	selector: 'clues',
	templateUrl: './clues.component.html',
	styleUrls: ['./clues.component.css']
})
export class CluesComponent implements OnInit {
	private clues: any = [];
	private locations: any = [];
	private num_locations_complete = 0;
	private num_weapons_complete = 0;
	private num_suspects_complete = 0;
	private weapons: any = [];
	private suspects: any = [];
	private clueNames: any = [];

	private detailClue: any = {};

	private complete: boolean = false;
	private loading: boolean = false;
	private error: string;

	@ViewChild('modal') public modal: ModalDirective;
	@ViewChild('completeModal') public completeModal: ModalDirective;

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
			this.filterClues();
			this.checkComplete();
		}, error => {
			this.loading = false;
			this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
		});
	}

	viewDetail(clue){
		this.detailClue = clue;
		this.modal.show();
	}

	filterClues() {
		for (var clue_id in this.clues) {
			var currentClue = this.clues[clue_id];
			switch (currentClue.type) {
				case "location":
					this.locations.push(currentClue);
					if(currentClue.complete){
						this.num_locations_complete++;
					}
					break;
				case "weapon":
					this.weapons.push(currentClue);
					if (currentClue.complete) {
						this.num_weapons_complete++;
					}
					break;
				case "suspect":
					this.suspects.push(currentClue);
					if (currentClue.complete) {
						this.num_suspects_complete++;
					}
					break;
				default:
					console.log('invalid clue type');
					break;
			}
		}
	}

	checkComplete() {
		if(this.num_locations_complete != this.locations.length - 1 ||
		   this.num_weapons_complete != this.weapons.length - 1 || 
		   this.num_suspects_complete != this.suspects.length - 1) {
			this.complete = false;
		} else {
			this.complete = true;
			this.completeModal.show();
		}
	}
}
