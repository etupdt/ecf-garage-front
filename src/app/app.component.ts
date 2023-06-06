import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { Login } from './interface/login.interface';
import { Garage } from './models/garage.model';
import { GarageService } from './services/garage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Garage V.Parrot';

  constructor (
    private loginService: LoginService,
  ) {

  }

  ngOnInit(): void {

    this.loginService.listenLogin.subscribe((login) => {this.login$ = login as Login})

    this.loginService.getToken()

  }

  login$: Login = {
    email: '',
    roles: []
  }

}
