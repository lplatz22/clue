import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TaskService, TASK_STATUS_CODES } from './task.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService, USER_STATUS_CODES } from '../user/user.service';
import { ModalDirective } from 'ng2-bootstrap';


@Component({
  moduleId: module.id,
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['../app.component.css']
})
export class TaskComponent implements OnInit {
	private task: any = [];
	private complete: boolean = false;
	private loading: boolean = false;
	private error: string;
	private completionError: string;
	private userAnswers: any = {};
	private failedQuiz: string;

	private quizForm: FormGroup;

	@ViewChild('modal') public modal:ModalDirective;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private taskService: TaskService,
				private userService: UserService,
				private fb: FormBuilder) {

		this.quizForm = fb.group({
			'question': [null, Validators.required]
		});
	}

	ngOnInit() {
		this.loading = true;
		this.error = null;

		let id = +this.route.snapshot.params['task_id'];
		this.taskService.getTaskById(id).subscribe(task => {
			this.loading = false;
			this.task = task;
		}, error => {
			this.loading = false;
			this.error = TASK_STATUS_CODES[error.status] || TASK_STATUS_CODES[500];
		});
	}

	taskComplete() {
		this.userService.completeTask(+this.route.snapshot.params['task_id']).subscribe(task => {
			this.task.complete = true;
			this.complete = true;
		}, error => {
			this.completionError = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
		});
		
	}

	checkQuiz(values) {
		var pass = true;
		for (var i = 0; i < this.task.quiz.length; ++i) {
			var question = this.task.quiz[i];
			var answer = values[i];
			if(question.answer.toLowerCase().trim() != answer.toLowerCase().trim()) {
				pass = false;
				break;
			}
		}
		if(pass) {
			this.taskComplete();
			this.failedQuiz = null;
		} else {
			this.failedQuiz = "Sorry, thats not right";
		}
		this.modal.show();
	}
}
