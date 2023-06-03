import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  errorMessage!: string

  email!: any
  listenEmail = new Observable( observer => { this.email = observer })
  roles: any = []
  listenRoles = new Observable( observer => { this.roles = observer })
  onglets: any = ['Accueil', 'Occasions', 'Contact']
  listenOnglets = new Observable<string[]>( observer => { this.onglets = observer })

  selectedTabIndex = 0

  constructor(
    private http: HttpClient,
  ) {  }

  initService = (): void => {

    const token = localStorage.getItem('tokenAuth');

    if (token) {

      const jwtHelper = new JwtHelperService();

      if (jwtHelper.isTokenExpired(token)) {

        localStorage.removeItem('tokenAuth')

      } else {

        const decodedToken = jwtHelper.decodeToken(token);

        console.log(decodedToken)

        this.email.next(decodedToken.username)
        this.roles.next(decodedToken.roles)

      }

    }

  }

  connection(email: string, password: string): Observable<any>  {

    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json')

    return this.http.post (
      environment.useBackend + `/api/login`,
      {username: email, password: password},
      {headers}
    )

  }

}
