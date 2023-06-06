import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/user`
    )

  }

  putUser(user: User): Observable<any> {

    return this.http.put(
      environment.useBackend + `/api/user/${user.id}`,
      user
    )

  }

  postUser(user: User): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/user`,
      user
    )

  }

  deleteUser(id: number): Observable<any>{

    return this.http.delete(
      environment.useBackend + `/api/user/${id}`
    )

  }

}
