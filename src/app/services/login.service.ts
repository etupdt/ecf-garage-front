import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from '../interface/login.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  errorMessage!: string

  token: string = ''

  login = new BehaviorSubject<Login>({
    email: '',
    roles: []
  })
  listenLogin = this.login.asObservable()

  selectedTabIndex: number = 0

  constructor(
    private http: HttpClient,
  ) { }

  connection = (email: string, password: string): Observable<any> => {

    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json')

    return this.http.post (
      environment.useBackend + `/api/login`,
      {username: email, password: password},
      {headers}
    )

  }

  deConnection = () => {

    const token = localStorage.getItem('tokenAuth');

    if (token) {

      localStorage.removeItem('tokenAuth')

    }

    this.login.next({
      email: '',
      roles: []
    })

  }


  getToken = () => {

    const token = localStorage.getItem('tokenAuth');

    if (token) {

      const jwtHelper = new JwtHelperService();

      if (jwtHelper.isTokenExpired(token)) {

        localStorage.removeItem('tokenAuth')

        return null

      } else {

        if (token !== this.token) {

          const decodedToken = jwtHelper.decodeToken(token);

          this.login.next({
            email: decodedToken.username,
            roles: decodedToken.roles
          })

          this.token = token

        }

      }

    }

    return token

  }

}
