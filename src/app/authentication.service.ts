import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
	private loggedIn: boolean;
	private admin: boolean;

	constructor(private http: Http) { 
		this.loggedIn = false;
		this.admin = false;
	}

	login(user) {
		let body = JSON.stringify(user);
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post('/api/login', body, <RequestOptionsArgs>{ headers: headers, withCredentials: true })
			.map((res: Response) => res)
			.catch(this.handleError);
	}

	logout() {
		return this.http.get('/api/logout', <RequestOptionsArgs>{ withCredentials: true })
			.map((res: Response) => res)
			.catch(this.handleError);
	}

	authenticated() {
		return this.http.get('/api/authenticated', <RequestOptionsArgs>{ withCredentials: true })
			.map((res: Response) => res.json())
			.catch(this.handleError);
	}

	isLoggedIn() {
		return this.loggedIn;
	}

	setLoggedIn(bool) {
		this.loggedIn = bool;
		if(!this.loggedIn) {
			this.admin = false;
		}
	}

	setAdmin(bool) {
		this.admin = bool;
	}

	isAdmin() {
		return this.admin;
	}

	private handleError(error: Response) {
		console.log(error);

		return Observable.throw(error || "Server Error");
	}
}
