
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  items: string[] = []

  email: string = ''
  roles: string[] = []

  burgerMenu = 'cache'
  selectedTabIndex!: number

  constructor (
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.loginService.listenEmail.subscribe((email) => {this.email = email as string})
    this.loginService.listenRoles.subscribe((roles) => {this.roles = roles as string[]})

    this.router.config.forEach((route) => this.items.push(route.path as string))

  }

  signOut = () => {
  }

  callRoute = (target?: string) => {
    this.burgerMenu = 'cache'
    this.loginService.routeSelected = target!
    this.router.navigate([target])
  }

}
