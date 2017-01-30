import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService, TASK_STATUS_CODES } from './task.service';
import { ProgressbarModule } from 'ng2-bootstrap/progressbar';

@Component({
  moduleId: module.id,
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  // styleUrls: ['./app.component.css']
})
export class TaskListComponent implements OnInit {
	private tasks: any = [];
	private loading: boolean = false;
	private error: string;

	public dynamic: number;
  	public type: string;
  	public message: string;

	constructor(private router: Router,
				private taskService: TaskService) {
	}

	ngOnInit() {
		this.loading = true;
		this.error = null;

		this.taskService.getAllTasks().subscribe(tasks => {
			this.loading = false;
			this.tasks = tasks;
			this.markProgress();
		}, error => {
			this.loading = false;
			this.error = TASK_STATUS_CODES[error.status] || TASK_STATUS_CODES[500];
		});
	}

	markProgress(){
		var numComplete = 0;
		for (var i = 0; i < this.tasks.length; ++i) {
			if (this.tasks[i].complete){
				numComplete += 1;
			}
		}

		this.dynamic = numComplete / this.tasks.length * 100;
		var percentage = Math.round(this.dynamic);

		if(this.dynamic <= 33.33){
			this.type = "danger";
		} else if (this.dynamic <= 66.66) {
			this.type = "warning";
		}else if (this.dynamic <= 100) {
			if(this.dynamic == 100){
				this.type = "success";
			} else {
				this.type = "info";
			}
		}

		if(this.dynamic != 0) {
			this.message = percentage + "%";
		}

	}

	getClass(task){
		console.log(task);
	}
}
