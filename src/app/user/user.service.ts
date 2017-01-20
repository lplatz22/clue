
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

@Injectable()
export class UserService {

  constructor(private http: Http){
  };

  login(user) {
    return this.http.post('/api/login', { user: user })
      .map(res => res.json());
  }

  register(newUser) {
    return this.http.post('/api/register', { user: newUser })
      .map(res => res.json());
  }

 //  getTaskById(id) {
  	
 //  	let params: URLSearchParams = new URLSearchParams();
	// params.set('task_id', id);

 //  	return this.http.get('/api/task', { search: params })
 //      .map(res => res.json());
 //  }
}