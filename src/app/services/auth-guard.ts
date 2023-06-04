import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Login } from '../interface/login.interface';
import { last } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  login$: Login = {
    email: '',
    roles: ['tutu']
  }

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginService.listenLogin.subscribe((roles) => {this.login$ = roles as Login})
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.loginService.getToken();
    if (token) {
      return true;
    } else {
      this.router.navigateByUrl('/api/login');
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.loginService.getToken();
    console.log(this.loginService.login.pipe(last()))
    if (token && this.login$.roles.indexOf(route.data['role']) >= 0) {
      return true;
    } else {
      return false;
    }
  }

}
