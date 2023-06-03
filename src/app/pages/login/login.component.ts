import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
console.log(this.loginService.selectedTabIndex)
        this.router.navigate([this.loginService.onglets[
          this.loginService.selectedTabIndex < 3 ? this.loginService.selectedTabIndex : 0
        ]])

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

}
