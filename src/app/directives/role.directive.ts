import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Login } from '../interface/login.interface';

@Directive({
  selector: '[role]'
})
export class RoleDirective {

  login$: Login = {
    email: '',
    roles: []
  }

  constructor(
    private loginService: LoginService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {}

  @Input()
  set role(r: string) {

    this.loginService.listenLogin.subscribe((login) => {

      switch (r) {

        case 'VISITOR' : {
          if (login.roles.length !== 0) {
            this.viewContainer.clear()
          } else {
            this.viewContainer.createEmbeddedView(this.templateRef)
          }
          break
        }

        default : {
          console.log('roles', `ROLE_${r}`)
          if (login.roles.indexOf(`ROLE_${r}`) < 0) {
            this.viewContainer.clear()
          } else {
            this.viewContainer.createEmbeddedView(this.templateRef)
          }
          break
        }

      }

    })

  }

}
