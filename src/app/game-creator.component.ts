import { Component, OnInit, ViewChild, Pipe, PipeTransform, Injectable } from '@angular/core';
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

	private locations: any = {};
	private suspects: any = {};
	private weapons: any = {};
	private tasks: any[] = [];
	private clues: any = {};
	private currentTaskIndex: number;
	private currentQuestionIndex: number;

	private selected: any = {};
	private selectedClue: any = {};
	private question: any = {};
	private reveal: any = {};
	private description: string;

	private invalid: string[] = [];
	private validated: boolean = false;

	@ViewChild('questionModal') private questionModal: ModalDirective;
	@ViewChild('loadModal') private loadingModal: ModalDirective;
	@ViewChild('clueModal') private clueModal: ModalDirective;


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
			this.clues = response.clues;
			this.reveal = response.reveal;
			this.description = response.description;
			this.loadingModal.hide();
		}, error => {
			this.loadingModal.hide();
			this.error = TASK_STATUS_CODES[error.status] || TASK_STATUS_CODES[500];
			console.log(this.error);
		});
	}

	addClue(type){
		this.selectedClue = {
			type: type
		};
		this.clueModal.show();
	}
	editClue(clue_id){
		console.log("edit: " + this.clues[clue_id].text);
		this.selectedClue = JSON.parse(JSON.stringify(this.clues[clue_id]));
		this.selectedClue.clue_id = clue_id;
		this.clueModal.show();
	}
	removeClue(clue_id){
		delete this.clues[clue_id];
	}
	saveClue(){
		if(this.selectedClue.clue_id){
			var id = this.selectedClue.clue_id;
			delete this.selectedClue.clue_id;
			this.clues[id] = this.selectedClue;
			console.log(this.clues[id]);
		} else {
			var newID = Math.max.apply(null, Object.keys(this.clues).map(Number)) + 1;
			console.log(newID);
			this.clues[newID] = this.selectedClue;
		}
		this.clueModal.hide();
	}

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
		console.log(this.reveal);
		console.log(this.clues);
		console.log(this.tasks);
		// var fullGameJSON = {
		// 	description: this.description,
		// 	reveal: this.reveal,
		// 	locations: this.locations,
		// 	suspects: this.suspects,
		// 	weapons: this.weapons,
		// 	tasks: this.tasks
		// }
		// this.loadingModal.show();
		// this.submitting = true;
		// this.taskService.writeGame(fullGameJSON).subscribe(response => {
		// 	this.loadingModal.hide();
		// 	this.submitting = false;
		// }, error => {
		// 	this.loadingModal.hide();
		// 	this.submitError = TASK_STATUS_CODES[error.status] || TASK_STATUS_CODES[500];
		// });
	}

	validate() {
		this.validated = false;
		this.invalid = [];

		// var clues = {};

		// for (var i = this.locations.length - 1; i >= 0; i--) {
		// 	if (this.locations[i] == null || this.locations[i] == ""){
		// 		this.invalid.push("Location #: "+ (i + 1) + " - Location name is empty or invalid");
		// 	}
		// 	clues[this.locations[i]] = false;
		// }
		// for (var i = this.weapons.length - 1; i >= 0; i--) {
		// 	if (this.weapons[i] == null || this.weapons[i] == "") {
		// 		this.invalid.push("Weapon #: " + (i + 1) + " - Weapon name is empty or invalid");
		// 	}
		// 	clues[this.weapons[i]] = false;
		// }
		// for (var i = this.suspects.length - 1; i >= 0; i--) {
		// 	if (this.suspects[i] == null || this.suspects[i] == "") {
		// 		this.invalid.push("Suspect #: " + (i + 1) + " - Suspect name is empty or invalid");
		// 	}
		// 	clues[this.suspects[i]] = false;
		// }

		// if (this.reveal.location == "" || this.reveal.location == null){
		// 	this.invalid.push("Reveal Location is invalid");
		// } else {
		// 	clues[this.reveal.location] = true;
		// }
		// if (this.reveal.suspect == "" || this.reveal.suspect == null) {
		// 	this.invalid.push("Reveal Suspect is invalid");
		// } else {
		// 	clues[this.reveal.suspect] = true;
		// }
		// if (this.reveal.weapon == "" || this.reveal.weapon == null) {
		// 	this.invalid.push("Reveal Weapon is invalid");
		// } else {
		// 	clues[this.reveal.weapon] = true;
		// }
		
		// var idealNumTasks = (this.locations.length + this.weapons.length + this.suspects.length) - 3;
		// if(this.tasks.length != idealNumTasks){
		// 	this.invalid.push("Due to the current number of Locations, Suspects, and Weapons, There must be exactly " + idealNumTasks + " tasks");
		// }

		// for (var i = 0; i < this.tasks.length; i++) {
		// 	//check name isnt "" - check video url isnt null - description isnt null
		// 	if(this.tasks[i].name == null || this.tasks[i].name == "") {
		// 		this.invalid.push("Task: \"" + this.tasks[i].name + "\" - Name is invalid");
		// 	}
		// 	if (this.tasks[i].video_url == null || this.tasks[i].video_url == "") {
		// 		this.invalid.push("Task: \"" + this.tasks[i].name + "\" - Video_URL is invalid");
		// 	}
		// 	if (this.tasks[i].desc == null || this.tasks[i].desc == "") {
		// 		this.invalid.push("Task: \"" + this.tasks[i].name + "\" - Description is invalid");
		// 	}
		// 	if (this.tasks[i].quiz.length == 0) {
		// 		this.invalid.push("Task: \"" + this.tasks[i].name + "\" - Quiz is empty");
		// 	}
		// 	for (var q = 0; q < this.tasks[i].quiz.length; q++){
		// 		if (this.tasks[i].quiz[q].question == null || this.tasks[i].quiz[q].question == ""){
		// 			this.invalid.push("Task: \"" + this.tasks[i].name + "\", Question: \""+this.tasks[i].quiz[q].question+"\" - question is invalid");
		// 		}
		// 		if (this.tasks[i].quiz[q].answer == null || this.tasks[i].quiz[q].answer == "") {
		// 			this.invalid.push("Task: \"" + this.tasks[i].name + "\", Question: \"" + this.tasks[i].quiz[q].question + "\" - answer is invalid");
		// 		}
		// 		if(this.tasks[i].quiz[q].answers){
		// 			if (this.tasks[i].quiz[q].answers.length != 4){
		// 				this.invalid.push("Task: \"" + this.tasks[i].name + "\", Question: \"" + this.tasks[i].quiz[q].question + "\" - Not enough answers are valid");
		// 			}
		// 			for (var a = 0; a < this.tasks[i].quiz[q].answers.length; a++){
		// 				if (this.tasks[i].quiz[q].answers[a] == "" || this.tasks[i].quiz[q].answers[a] == null){
		// 					this.invalid.push("Task: \"" + this.tasks[i].name + "\", Question: \"" + this.tasks[i].quiz[q].question + "\" - some answers are invalid");
		// 				}
		// 			}
		// 		}
		// 	}


		// 	//quiz[] > 0
		// 	if(clues[this.tasks[i].clue]) {
		// 		this.invalid.push("Task: \""+ this.tasks[i].name + "\" - Clue already taken");
		// 	} else {
		// 		clues[this.tasks[i].clue] = true;
		// 	}

		// }

		this.validated = true;
		if(this.invalid.length > 0) {
			return false;
		} else {
			return true;
		}
	}
}

@Pipe({ name: 'keys', pure: false })
@Injectable()
export class KeysPipe implements PipeTransform {
	transform(value, args: string[]): any {
		let keys = [];
		for (let key in value) {
			keys.push({ key: key, value: value[key] });
		}
		return keys;
	}
}


@Pipe({
	name: 'clueFilter',
	pure: false
})
@Injectable()
export class ClueFilterPipe implements PipeTransform {
	transform(clues: any[], term: string): any {
		// filter items array, items which match and return true will be kept, false will be filtered out
		return clues.filter(clue => {
			if (clue.value.type == term) {
				return true;
			} 
			return false;
		});
	}
}
