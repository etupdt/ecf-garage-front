import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  signInForm!: FormGroup
  errorMessage!: string

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.initForm()
  }

  initForm = () => {
    this.signInForm = this.formBuilder.group({
      email: ["vincent.parrot@garage.com", [Validators.required, Validators.email]],
      password: ["achanger", [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
    })
  }

  onSubmit = () => {

    const email = this.signInForm.get("email")!.value
    const password = this.signInForm.get("password")!.value

    this.loginService.connection(email, password)

    this.loginService.connection(email, password).subscribe({
      next: (res: any) => {

        localStorage.setItem('tokenAuth', res.token)
        this.loginService.email.next(email)
        this.loginService.roles.next(res.data.roles)

        this.router.navigate([this.loginService.onglets[this.loginService.selectedTabIndex]])

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
