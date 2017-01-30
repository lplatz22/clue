
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class TaskService {

  constructor(private http: Http){
  };

  getAllTasks() {

    return this.http.get('/api/tasks', <RequestOptionsArgs>{ withCredentials: true })
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getTaskById(id) {

  	let params: URLSearchParams = new URLSearchParams();
	  params.set('task_id', id);

    return this.http.get('/api/task', <RequestOptionsArgs>{ search: params, withCredentials: true })
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getFullGame() {
    return this.http.get('/api/admin/fullGame', <RequestOptionsArgs>{ withCredentials: true })
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  getGameDescription() {
    return this.http.get('/api/admin/game/description', <RequestOptionsArgs>{ withCredentials: true })
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  writeGame(game) {
    
    let body = {
      game: game
    };

    return this.http.post('/api/admin/fullGame', body, <RequestOptionsArgs>{ withCredentials: true })
      .map((res: Response) => res)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.log('error handled by handleError');
    console.log(error);

    return Observable.throw(error || "Server Error");
  }
}

export var TASK_STATUS_CODES = {
  401: "Unauthenticated",
  500: "Oops.. Something went wrong"
}