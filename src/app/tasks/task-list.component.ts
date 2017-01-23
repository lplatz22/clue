import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService, TASK_STATUS_CODES } from './task.service';

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
	constructor(private router: Router,
				private taskService: TaskService) {
	}

	ngOnInit() {
		this.loading = true;
		this.error = null;

		this.taskService.getAllTasks().subscribe(tasks => {
			this.loading = false;
			this.tasks = tasks;
			// this.markTasksComplete();
		}, error => {
			this.loading = false;
			this.error = TASK_STATUS_CODES[error.status] || TASK_STATUS_CODES[500];
		});
	}
}
