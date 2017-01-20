import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TaskService } from './task.service';

@Component({
  moduleId: module.id,
  selector: 'task',
  templateUrl: './task.component.html',
  // styleUrls: ['./app.component.css']
})
export class TaskComponent implements OnInit {
	private task: any = [];
	private complete: boolean = false;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private taskService: TaskService) {
	}

	ngOnInit() {
		let id = +this.route.snapshot.params['task_id'];
		console.log(id);
		this.taskService.getTaskById(id).subscribe(task => {
			this.task = task;
		});
	}

	taskComplete() {
		//TODO: mark task complete on server - once users implemented
		//TODO: get clue from server with clue_id - currently the clue is just stored with task
		this.complete = true;
	}
}
