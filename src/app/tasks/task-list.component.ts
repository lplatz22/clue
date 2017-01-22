import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService, TASK_STATUS_CODES } from './task.service';
import { UserService } from '../user/user.service';

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
				private userService: UserService,
				private taskService: TaskService) {
	}

	ngOnInit() {
		this.loading = true;
		this.error = null;

		this.taskService.getAllTasks().subscribe(tasks => {
			this.loading = false;
			this.tasks = tasks;
			this.markTasksComplete();
		}, error => {
			this.loading = false;
			this.error = TASK_STATUS_CODES[error.status] || TASK_STATUS_CODES[500];
		});
	}

	private markTasksComplete() {
		this.userService.getCompletedTasks().subscribe( user => {
			console.log(user);
			this.loading = false;

			for (var i = this.tasks.length - 1; i >= 0; i--) {
				if(user.tasksComplete[this.tasks[i]._id]){
					this.tasks[i].complete = true;
				}
			}
		}, error => {
			this.loading = false;
			this.error = TASK_STATUS_CODES[error.status] || TASK_STATUS_CODES[500];
		});
	}
}
