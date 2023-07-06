

import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
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
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initForm()
  }

  initForm = () => {
    this.signInForm = this.formBuilder.group({
      email: [
        "vincent.parrot@garage.com",
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        "!!aaaAAA11",
        [
          Validators.required,
//          Validators.minLength(10),
//          Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*\-\+\?\!])[0-9a-zA-Z\*\+\?\!]+$/)
        ]
      ],
    })
  }

  onSubmit = () => {

    const email = this.signInForm.get("email")!.value
    const password = this.signInForm.get("password")!.value

    this.loginService.connection(email, password)

    this.loginService.connection(email, password).subscribe({
      next: (res: any) => {

        localStorage.setItem('tokenAuth', res.token)
        this.loginService.login.next({
          email: email,
          roles: res.data.roles
        })
//        this.router.navigate(['Accueil'])
        this.router.navigate([this.router.config[this.loginService.selectedTabIndex].path])

      },
      error: (error) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur de connexion pour l'email : ${email}`,
            message2: error.error.message,
            delai: 0
          }
        })
      }
    })

  }

  get email() { return this.signInForm.get('email')! as FormControl }
  get password() { return this.signInForm.get('password')! as FormControl }

}
