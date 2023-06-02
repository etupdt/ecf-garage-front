
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  email: string = ''
  roles: string[] = []
  onglets = ['Accueil', 'Occasions', 'Contact']

  burgerMenu = 'cache'
  selectedTabIndex: number = 0

  constructor (
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.loginService.listenEmail.subscribe((email) => {this.email = email as string})
    this.loginService.listenRoles.subscribe((roles) => {this.roles = roles as string[]})

    const selectedTabIndex = localStorage.getItem('selectedTabIndex')
    if (selectedTabIndex)
      this.selectedTabIndex = +localStorage.getItem('selectedTabIndex')!

    this.loginService.initService()

  //  this.router.config.forEach((route) => this.items.push(route.path as string))

  }

  signOut = () => {

    const token = localStorage.getItem('tokenAuth');

    if (token) {

      localStorage.removeItem('tokenAuth')

      this.loginService.email.next("")
      this.loginService.roles.next("")

      if (this.selectedTabIndex > 2)
        this.selectedTabIndex = 0

  }

  }

  callRoute = (target?: string) => {

    localStorage.setItem('selectedTabIndex', `${this.selectedTabIndex}`)
    this.loginService.selectedTabIndex = this.selectedTabIndex

    this.burgerMenu = 'cache'
    this.loginService.routeSelected = target!
    this.router.navigate([target])

  }

}
