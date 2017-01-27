import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
	moduleId: module.id,
	selector: 'game-creator',
	templateUrl: './game-creator.component.html',
	styleUrls: ['./game-creator.component.css']
})
export class GameCreatorComponent implements OnInit {

	private locations: string[] = [];
	private suspects: string[] = [];
	private weapons: string[] = [];
	private tasks: any[] = [];
	private currentTaskIndex: number;
	private currentQuestionIndex: number;

	private selected: any = {};
	private question: any = {};

	@ViewChild('locationModal') private locationModal: ModalDirective;
	@ViewChild('weaponModal') private weaponModal: ModalDirective;
	@ViewChild('suspectModal') private suspectModal: ModalDirective;
	@ViewChild('questionModal') private questionModal: ModalDirective;



	constructor(private router: Router) {
		//get game.json from server and load respective parts
	}

	ngOnInit() {
		//load this from task service obviously
		this.locations = [
			"Dogwood",
			"Maggie Maes",
			"Blackheart",
			"Craft Pride"
		]

		this.suspects = [
			"Competing CEO A",
			"Competing CEO B",
			"Competing CEO C"
		]

		this.weapons = [
			"USB Stick",
			"Phishing Email",
			"Evil Computer Program A"
		]

		this.tasks = [
			{
				"name": "Task 1",
				"desc": "Task 1 information here",
				"video_url": "https://www.youtube.com/embed/plJe0uDszaY",
				"quiz": [
					{
						"question": "What is Banker's Mascott?",
						"answers": [
							"Lion",
							"Tiger",
							"Penguin",
							"Bear"
						],
						"answer": "Penguin"
					}
				],
				"clue": "Maggie Maes"
			},
			{
				"name": "Task 2",
				"desc": "Task 2 information here",
				"video_url": "https://www.youtube.com/embed/plJe0uDszaY",
				"quiz": [
					{
						"question": "What city is Bankers Toolbox located in?",
						"answers": [
							"New York",
							"Austin",
							"San Jose",
							"Seattle"
						],
						"answer": "Austin"
					},
					{
						"question": "Write out the following number: 5",
						"answer": "five"
					}
				],
				"clue": "Competing CEO B"
			},
			{
				"name": "Task 3",
				"desc": "Task 3 information here",
				"video_url": "https://www.youtube.com/embed/plJe0uDszaY",
				"quiz": [
					{
						"question": "What is Luke's favorite bar on 6th street?",
						"answers": [
							"Blind Pig",
							"Old School",
							"Cheers",
							"Maggie Maes"
						],
						"answer": "Maggie Maes"
					},
					{
						"question": "Write out the following number: 10",
						"answer": "ten"
					}
				],
				"clue": "USB Stick"
			}
		];
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
		console.log('New Task');
		this.tasks.push({
			name: "New Task",
			desc: "New Task Description",
			video_url: "url here",
			clue: "",
			quiz: []
		});
	}
	removeTask(index, event){
		console.log('removing task: ' + index);
		event.stopPropagation();
		this.tasks.splice(index, 1);
	}
	//******************************************
}
