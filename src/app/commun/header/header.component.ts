
import { Component, Inject, Input, OnInit, Optional, SimpleChanges } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Login } from 'src/app/interface/login.interface';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  onglets!: Route[]
  adminItems?: Route[]

  @Input() login: Login = {
    email: '',
    roles: []
  }

  burgerMenu = 'cache'

  constructor (
    private loginService: LoginService,
    private router: Router,
  ) {}

  get selectedTabIndex () {
    return this.loginService.selectedTabIndex
  }

  set selectedTabIndex (index: number) {
    this.loginService.selectedTabIndex = index
  }

  ngOnInit(): void {

    const selectedTabIndex = localStorage.getItem('selectedTabIndex')
    if (selectedTabIndex)
      this.selectedTabIndex = +localStorage.getItem('selectedTabIndex')!

  }

  signOut = () => {

    this.loginService.deConnection()

    if (this.selectedTabIndex > 2)
      this.selectedTabIndex = 0

  }

  getRouterConfig = () => {
    this.adminItems = this.getRouterChildConfig('Administration')
    return this.router.config.filter(route => {
      return route.path !== 'Signin' && (this.loginService.getToken() || !route.canActivate)
    })
  }

  getRouterChildConfig = (path: string) => {
    const retour =  this.router.config.find(route => route.path === path)!.children?.filter(child => {
      return this.login.roles.indexOf(child.data!['role']) >= 0
    })
    return retour
  }

  callRoute = (target?: string) => {

    localStorage.setItem('selectedTabIndex', `${this.selectedTabIndex}`)

    this.burgerMenu = 'cache'
    if (target)
      this.router.navigate([target])
    else
      this.router.navigate([this.router.config[this.selectedTabIndex].path])

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['login']) {
      this.onglets = this.getRouterConfig()
    }
  }

}
