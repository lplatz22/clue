import { Component, OnInit, ViewChild, Pipe, PipeTransform, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap';
import { UserService, USER_STATUS_CODES } from './user/user.service';
import { TaskService, TASK_STATUS_CODES } from './tasks/task.service';

@Component({
	moduleId: module.id,
	selector: 'user-progress',
	templateUrl: './user-progress.component.html',
	styleUrls: ['./app.component.css']
})
export class UserProgressComponent {
	private users: any[] = [];
	private tasks: any[] = [];
	private error: string;

	private sort: string;
	private invert: number = 1;

	private filterValue: string;

	// private sortType: string = "user.lastName";

	constructor(private router: Router,
				private userService: UserService,
				private taskService: TaskService) {

		this.userService.getUserProgress().subscribe(response => {
			this.users = response;
		}, error => {
			this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
			console.log(this.error);
		});

		this.taskService.getAllTasks().subscribe(response => {
			this.tasks = response;
		}, error => {
			this.error = USER_STATUS_CODES[error.status] || USER_STATUS_CODES[500];
			console.log(this.error);
		});
	}

	getNumCompleted(user){
		return Object.keys(user.tasksComplete).length;
	}

	getType(user){
		var percentage = Math.round((this.getNumCompleted(user) / this.tasks.length) * 100);

		if (percentage <= 33.33) {
			return "danger";
		} else if (percentage <= 66.66) {
			return "warning";
		} else if (percentage <= 100) {
			if (percentage == 100) {
				return "success";
			} else {
				return "info";
			}
		}
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

@Pipe({
	name: 'userFilter',
	pure: false
})
@Injectable()
export class UserFilterPipe implements PipeTransform {
	transform(users: any[], term: string): any {
		// filter items array, items which match and return true will be kept, false will be filtered out
		return users.filter(user => {
			if (term == "" || term == null) {
				return true;
			}

			var termArray = term.split(' ');
			for (var i = 0; i < termArray.length; i++){
				if (user.email.toLowerCase().includes(termArray[i].toLowerCase()) ||
					user.firstName.toLowerCase().includes(termArray[i].toLowerCase()) ||
					user.lastName.toLowerCase().includes(termArray[i].toLowerCase()) ||
					user.company.toLowerCase().includes(termArray[i].toLowerCase())) {
				} else {
					return false;
				}
			}
			return true;
		});
	}
}
