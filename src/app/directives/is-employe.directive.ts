import { Directive, ElementRef, OnInit, ViewContainerRef, inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { CommonModule, NgIf } from '@angular/common';

@Directive({
  selector: '[isEmploye]',
})
export class IsEmployeDirective implements OnInit {

  private readonly ngIfDirective = inject(NgIf);

  constructor(
    private loginService: LoginService,
    private viewContainer: ViewContainerRef,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.loginService.listenLogin.subscribe((login) => {

      if (login.roles.indexOf('ROLE_USER') < 0) {
        this.viewContainer.clear();
      }

    })

  }

}
