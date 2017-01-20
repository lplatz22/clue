
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

@Injectable()
export class TaskService {

  constructor(private http: Http){
  };

  getAllTasks() {
    return this.http.get('/api/tasks')
      .map(res => res.json());
  }

  getTaskById(id) {
  	
  	let params: URLSearchParams = new URLSearchParams();
	params.set('task_id', id);

  	return this.http.get('/api/task', { search: params })
      .map(res => res.json());
  }
}