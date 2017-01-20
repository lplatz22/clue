import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from './task.service';

@Component({
  moduleId: module.id,
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  // styleUrls: ['./app.component.css']
})
export class TaskListComponent implements OnInit {
	private tasks: any = [];

	constructor(private router: Router,
				private taskService: TaskService) {
	}

	ngOnInit() {
		this.taskService.getAllTasks().subscribe(tasks => {
			this.tasks = tasks;
		});
	}
}
