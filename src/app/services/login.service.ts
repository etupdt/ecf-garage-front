import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  errorMessage!: string

  email!: any
  listenEmail = new Observable( observer => { this.email = observer })
  roles: any = []
  listenRoles = new Observable( observer => { this.roles = observer })

  routeSelected: string = 'Accueil'

  constructor(
    private http: HttpClient,
  ) { }

  connection(email: string, password: string): void {

    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json')

    this.http.post(
      environment.useBackend + `/api/login`,
      {username: email, password: password},
      {headers}
    ).subscribe({
      next: (res: any) => {
        localStorage.setItem('tokenAuth', res.token)
        this.email.next(email)
        this.roles.next(res.data.roles)
    },
      error: (error) => {
        console.log(error)
//        this.errorMessage = error.error
      },
      complete () {
        console.log('header connection complete')
      }
    })

  }

}
