
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class TaskService {

  constructor(private http: Http){
  };

  getAllTasks() {
    return this.http.get('/api/tasks')
      .map(res => res.json());
  }
}