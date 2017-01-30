import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService, TASK_STATUS_CODES } from './tasks/task.service';
import { AuthenticationService } from './authentication.service';

@Component({
  moduleId: module.id,
  templateUrl: './home.component.html',
  // styleUrls: ['./app.component.css']
})
export class HomeComponent {
	private gameDescription: string;
	private loading: boolean = false;
	private error: string;

	constructor(private router: Router,
				private taskService: TaskService,
				private authService: AuthenticationService) {
		this.loading = true;
		this.taskService.getGameDescription().subscribe(response => {
			this.gameDescription = response;
			this.loading = false;
		}, error => {
			this.error = TASK_STATUS_CODES[error.status] || TASK_STATUS_CODES[500];
			console.log(this.error);
		});
		
	}
}
