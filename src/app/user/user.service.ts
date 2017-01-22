
import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {

  constructor(private http: Http){
  };

  login(user) {
    let body = JSON.stringify(user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post('/api/login', body, <RequestOptionsArgs> {headers: headers, withCredentials: true})
                    .map((res: Response) => res)
                    .catch(this.handleError);
  }

  register(newUser) {
    let body = {
      user: newUser
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post('/api/register', body, <RequestOptionsArgs>{ headers: headers, withCredentials: true })
                    .map((res: Response) => res)
                    .catch(this.handleError);
  }

  getProfile() {
    return this.http.get('/api/profile', <RequestOptionsArgs> { withCredentials: true })
            .map((res: Response) => res.json())
            .catch(this.handleError);
  }

  getCompletedTasks() {
    
    return this.http.get('/api/user/tasks', <RequestOptionsArgs>{ withCredentials: true })
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  authenticated() {
    return this.http.get('/api/authenticated', <RequestOptionsArgs> {withCredentials: true})
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.log('error handled by handleError');
    console.log(error);

    return Observable.throw(error || "Server Error");
  }
}

export var USER_STATUS_CODES = {
  400: "User already exists",
  401: "Invalid credentials",
  500: "Oops.. Something went wrong"
}