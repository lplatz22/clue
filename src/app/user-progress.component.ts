import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { UserService, USER_STATUS_CODES } from './user/user.service';
import { TaskService, TASK_STATUS_CODES } from './tasks/task.service';

@Component({
	moduleId: module.id,
	selector: 'user-progress',
	templateUrl: './user-progress.component.html'
	// styleUrls: ['./user-progress.component.css']
})
export class UserProgressComponent {
	private users: any[] = [];
	private tasks: any[] = [];
	private error: string;

	private sort: string;
	private invert: number = 1;

	// private sortType: string = "user.lastName";

	constructor(private router: Router,
				private userService: UserService,
				private taskService: TaskService) {

		this.userService.getUserProgress().subscribe(response => {
			console.log(response);
			this.users = response;
		}, error => {
			this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
			console.log(this.error);
		});

		this.taskService.getAllTasks().subscribe(response => {
			console.log(response);
			this.tasks = response;
		}, error => {
			this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
			console.log(this.error);
		});
	}

	getNumCompleted(user){
		return Object.keys(user.tasksComplete).length;
	}

	sortBy(sortName){
		if(this.sort == sortName){ //already sorting by email - invert
			this.invert *= -1;
		} else {
			this.sort = sortName;
			this.invert = 1;
		}
		
		if(this.sort != 'progress'){
			this.users.sort((a, b) => {
				if (a[sortName].toLowerCase() > b[sortName].toLowerCase()) {
					return 1 * this.invert;
				} else if (a[sortName].toLowerCase() < b[sortName].toLowerCase()) {
					return -1 * this.invert;
				}
				return 0;
			});
		} else {
			this.users.sort((a, b) => {
				if (this.getNumCompleted(a) > this.getNumCompleted(b)) {
					return 1 * this.invert;
				} else if (this.getNumCompleted(a) < this.getNumCompleted(b)) {
					return -1 * this.invert;
				}
				return 0;
			});
		}
	}
}
