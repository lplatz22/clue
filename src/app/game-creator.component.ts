import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { TaskService, TASK_STATUS_CODES } from './tasks/task.service';

@Component({
	moduleId: module.id,
	selector: 'game-creator',
	templateUrl: './game-creator.component.html',
	styleUrls: ['./game-creator.component.css']
})
export class GameCreatorComponent implements OnInit {
	private error: string;
	private submitError: string;
	private submitting: boolean = false;

	private locations: string[] = [];
	private suspects: string[] = [];
	private weapons: string[] = [];
	private tasks: any[] = [];
	private currentTaskIndex: number;
	private currentQuestionIndex: number;

	private selected: any = {};
	private question: any = {};
	private reveal: any = {};
	private description: string;

	private invalid: string[] = [];
	private validated: boolean = false;


	@ViewChild('locationModal') private locationModal: ModalDirective;
	@ViewChild('weaponModal') private weaponModal: ModalDirective;
	@ViewChild('suspectModal') private suspectModal: ModalDirective;
	@ViewChild('questionModal') private questionModal: ModalDirective;
	@ViewChild('loadModal') private loadingModal: ModalDirective;



	constructor(private router: Router,
				private taskService: TaskService) {
	}

	ngOnInit() {
		this.invalid = [];
	}

	ngAfterViewInit() {
		this.loadingModal.show();
		this.taskService.getFullGame().subscribe(response => {
			this.tasks = response.tasks;
			this.locations = response.locations;
			this.weapons = response.weapons;
			this.suspects = response.suspects;
			this.reveal = response.reveal;
			this.description = response.description;
			this.loadingModal.hide();
		}, error => {
			this.loadingModal.hide();
			this.error = TASK_STATUS_CODES[error.status] || TASK_STATUS_CODES[500];
			console.log(this.error);
		});
	}

	// ********** Clue Game Elements ***********
	addLocation() {
		this.selected.name = "";
		this.selected.index = -1;
		this.locationModal.show();
	}
	editLocation(index) {
		this.selected.name = this.locations[index];
		this.selected.index = index;
		this.locationModal.show();
	}
	removeLocation(index) {
		this.locations.splice(index, 1);
		//WHEN REMOVING - VALIDATE YOU CAN REMOVE IT FROM TASKS FIRST - MAKE SURE ITS NOT USED IN A TASK
	}
	saveLocation(){
		this.locationModal.hide();
		if(this.selected.index >= 0){
			this.locations[this.selected.index] = this.selected.name;
		} else {
			this.locations.push(this.selected.name);
		}
	}

	addSuspect() {
		this.selected.name = "";
		this.selected.index = -1;
		this.suspectModal.show();
	}
	editSuspect(index) {
		this.selected.name = this.suspects[index];
		this.selected.index = index;
		this.suspectModal.show();
	}
	removeSuspect(index) {
		this.suspects.splice(index, 1);
	}
	saveSuspect() {
		this.suspectModal.hide();
		if (this.selected.index >= 0) {
			this.suspects[this.selected.index] = this.selected.name;
		} else {
			this.suspects.push(this.selected.name);
		}
	}

	addWeapon() {
		this.selected.name = "";
		this.selected.index = -1;
		this.weaponModal.show();
	}
	editWeapon(index) {
		this.selected.name = this.weapons[index];
		this.selected.index = index;
		this.weaponModal.show();
	}
	removeWeapon(index) {
		this.weapons.splice(index, 1);
	}
	saveWeapon() {
		this.weaponModal.hide();
		if (this.selected.index >= 0) {
			this.weapons[this.selected.index] = this.selected.name;
		} else {
			this.weapons.push(this.selected.name);
		}
	}
	// *****************************************

	addQuestion_Answers(task_index) {
		this.currentTaskIndex = task_index;
		this.currentQuestionIndex = -1;
		this.question = {
			question: "",
			answers: [
				"Answer 1",
				"Answer 2",
				"Answer 3",
				"Answer 4"
			],
			answer: "Answer 1"
		}
		this.questionModal.show();
	}
	editQuestion(task_index, q_index) {
		this.question = this.tasks[task_index].quiz[q_index];

		this.currentTaskIndex = task_index;
		this.currentQuestionIndex = q_index;

		this.questionModal.show();
	}
	addQuestion_NoAnswers(task_index) {
		this.currentTaskIndex = task_index;
		this.currentQuestionIndex = -1;
		this.question = {};
		this.questionModal.show();
	}
	removeQuestion(task_index, q_index) {
		this.tasks[task_index].quiz.splice(q_index, 1);
	}
	saveQuestion() {
		if(this.currentQuestionIndex >= 0) {
			this.tasks[this.currentTaskIndex].quiz[this.currentQuestionIndex] = this.question;
		} else {
			this.tasks[this.currentTaskIndex].quiz.push(this.question);
		}
		this.questionModal.hide();
	}


	//************Task Elements ****************
	newTask() {
		this.tasks.push({
			name: "New Task",
			desc: "New Task Description",
			video_url: "url here",
			clue: "",
			quiz: []
		});
	}
	removeTask(index, event){
		event.stopPropagation();
		this.tasks.splice(index, 1);
	}
	//******************************************

	submitGame(){
		console.log('all good! - submitting game');
		var fullGameJSON = {
			description: this.description,
			reveal: this.reveal,
			locations: this.locations,
			suspects: this.suspects,
			weapons: this.weapons,
			tasks: this.tasks
		}
		this.loadingModal.show();
		this.submitting = true;
		this.taskService.writeGame(fullGameJSON).subscribe(response => {
			this.loadingModal.hide();
			this.submitting = false;
		}, error => {
			this.loadingModal.hide();
			this.submitError = TASK_STATUS_CODES[error.status] || TASK_STATUS_CODES[500];
		});
	}

	validate() {
		this.validated = false;
		this.invalid = [];

		var clues = {};

		for (var i = this.locations.length - 1; i >= 0; i--) {
			if (this.locations[i] == null || this.locations[i] == ""){
				this.invalid.push("Location #: "+ (i + 1) + " - Location name is empty or invalid");
			}
			clues[this.locations[i]] = false;
		}
		for (var i = this.weapons.length - 1; i >= 0; i--) {
			if (this.weapons[i] == null || this.weapons[i] == "") {
				this.invalid.push("Weapon #: " + (i + 1) + " - Weapon name is empty or invalid");
			}
			clues[this.weapons[i]] = false;
		}
		for (var i = this.suspects.length - 1; i >= 0; i--) {
			if (this.suspects[i] == null || this.suspects[i] == "") {
				this.invalid.push("Suspect #: " + (i + 1) + " - Suspect name is empty or invalid");
			}
			clues[this.suspects[i]] = false;
		}

		if (this.reveal.location == "" || this.reveal.location == null){
			this.invalid.push("Reveal Location is invalid");
		} else {
			clues[this.reveal.location] = true;
		}
		if (this.reveal.suspect == "" || this.reveal.suspect == null) {
			this.invalid.push("Reveal Suspect is invalid");
		} else {
			clues[this.reveal.suspect] = true;
		}
		if (this.reveal.weapon == "" || this.reveal.weapon == null) {
			this.invalid.push("Reveal Weapon is invalid");
		} else {
			clues[this.reveal.weapon] = true;
		}
		
		var idealNumTasks = (this.locations.length + this.weapons.length + this.suspects.length) - 3;
		if(this.tasks.length != idealNumTasks){
			this.invalid.push("Due to the current number of Locations, Suspects, and Weapons, There must be exactly " + idealNumTasks + " tasks");
		}

		for (var i = 0; i < this.tasks.length; i++) {
			//check name isnt "" - check video url isnt null - description isnt null
			if(this.tasks[i].name == null || this.tasks[i].name == "") {
				this.invalid.push("Task: \"" + this.tasks[i].name + "\" - Name is invalid");
			}
			if (this.tasks[i].video_url == null || this.tasks[i].video_url == "") {
				this.invalid.push("Task: \"" + this.tasks[i].name + "\" - Video_URL is invalid");
			}
			if (this.tasks[i].desc == null || this.tasks[i].desc == "") {
				this.invalid.push("Task: \"" + this.tasks[i].name + "\" - Description is invalid");
			}
			if (this.tasks[i].quiz.length == 0) {
				this.invalid.push("Task: \"" + this.tasks[i].name + "\" - Quiz is empty");
			}
			for (var q = 0; q < this.tasks[i].quiz.length; q++){
				if (this.tasks[i].quiz[q].question == null || this.tasks[i].quiz[q].question == ""){
					this.invalid.push("Task: \"" + this.tasks[i].name + "\", Question: \""+this.tasks[i].quiz[q].question+"\" - question is invalid");
				}
				if (this.tasks[i].quiz[q].answer == null || this.tasks[i].quiz[q].answer == "") {
					this.invalid.push("Task: \"" + this.tasks[i].name + "\", Question: \"" + this.tasks[i].quiz[q].question + "\" - answer is invalid");
				}
				if(this.tasks[i].quiz[q].answers){
					if (this.tasks[i].quiz[q].answers.length != 4){
						this.invalid.push("Task: \"" + this.tasks[i].name + "\", Question: \"" + this.tasks[i].quiz[q].question + "\" - Not enough answers are valid");
					}
					for (var a = 0; a < this.tasks[i].quiz[q].answers.length; a++){
						if (this.tasks[i].quiz[q].answers[a] == "" || this.tasks[i].quiz[q].answers[a] == null){
							this.invalid.push("Task: \"" + this.tasks[i].name + "\", Question: \"" + this.tasks[i].quiz[q].question + "\" - some answers are invalid");
						}
					}
				}
			}


			//quiz[] > 0
			if(clues[this.tasks[i].clue]) {
				this.invalid.push("Task: \""+ this.tasks[i].name + "\" - Clue already taken");
			} else {
				clues[this.tasks[i].clue] = true;
			}

		}

		this.validated = true;
		if(this.invalid.length > 0) {
			return false;
		} else {
			return true;
		}
	}
}
