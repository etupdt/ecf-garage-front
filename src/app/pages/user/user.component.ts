import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Login } from 'src/app/interface/login.interface';
import { Garage } from 'src/app/models/garage.model';
import { User } from 'src/app/models/user.model';
import { GarageService } from 'src/app/services/garage.service';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [
    './user.component.scss',
    '../../app.component.scss'
  ]
})
export class UserComponent implements OnInit {

  @Input() user!: User
  @Output() sameuser: EventEmitter<User> = new EventEmitter();
  @Output() newuser: EventEmitter<User> = new EventEmitter<User>();
  @Input() state: string = "display"
  @Output() stateChange: EventEmitter<string> = new EventEmitter();

  lastUser!: User
  userH3Label: string = ''

  userForm!: FormGroup

  garage$!: Garage

  isUpdated = false

  login$: Login = {
    email: '',
    roles: []
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private loginService: LoginService,
    private garageService: GarageService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    this.loginService.listenLogin.subscribe((login) => {this.login$ = login as Login})
    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})

    this.initForm(this.userService.initUser())
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('onChangesUser')
    if (this.state === 'create') {
      this.initForm(this.userService.initUser())
    } else {
      this.initForm(this.user)
    }
  }

  ngOnDestroy(): void {
    this.quit()
  }


  quit = () => {

    if (this.isUpdated && !this.userForm.invalid) {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          type: 'Confirmation',
          message1: `Voulez vous sauvegarder l'utilisateur ?`,
          message2: "",
          buttons: ['Enregistrer', 'Ne pas enregistrer']
        }
      })

      dialogRef.afterClosed().subscribe(result => {

        switch (result) {
          case 'Enregistrer' : {
            this.saveUser()
            break
          }
        }
      });

    }
  }

  initForm = (user: User) => {

    if (user) {

      this.userForm = this.formBuilder.group({
        email: [
          user.email,
          [
            Validators.required,
            Validators.email
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\*\-\+\?\!])[0-9a-zA-Z\*\-\+\?\!]+$/)
          ]
        ],
        firstname: [
          user.firstname,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(32),
            Validators.pattern(/^[0-9a-zA-Z -']{0,}$/)
          ]
        ],
        lastname: [
          user.lastname,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(32),
            Validators.pattern(/^[0-9a-zA-Z -']{0,}$/)
          ]
        ],
        phone: [
          user.phone,
          [
            Validators.required,
            Validators.pattern(/^(0)[1-9]( \d{2}){4}$/),
          ]
        ],
      })

      this.userH3Label = this.user ? `${user.roles.indexOf('ROLE_ADMIN') >= 0 ? 'Administrateur' : 'Utilisateur'} ${user.firstname} ${user.lastname}` : ''

      this.userForm.disable()

      switch (this.state) {
        case 'update' : {
          if (this.login$.roles.indexOf('ROLE_ADMIN') >= 0) {
            this.userForm.enable()
            this.userForm.get('password')?.disable()
          }
          if (this.login$.email === this.user.email) {
            this.userForm.get('password')?.enable()
          }
          break
        }
        case 'create' : {
          this.userForm.enable()
          this.userForm.get('password')?.disable()
          this.userH3Label = 'Nouvel utilisateur'
          break
        }
      }

      this.isUpdated = false

      this.userForm.valueChanges.subscribe(change => {
        this.isUpdated = this.checkChanges()
      })

    }

  }

  checkChanges(): boolean {

    this.isUpdated = this.user.email !== this.userForm.get("email")!.value ||
      '' !== this.userForm.get("password")!.value ||
      this.user.firstname !== this.userForm.get("firstname")!.value ||
      this.user.lastname !== this.userForm.get("lastname")!.value ||
      this.user.phone !== this.userForm.get("phone")!.value

      return this.isUpdated

  }

  formatUser = (user: User): User => {

    return user.deserialize({
      id: this.user.id,
      email: this.userForm.get("email")?.value,
      password: this.state === 'create' ? '!!aaaAAA11' : this.userForm.get("password")?.value,
      firstname: this.userForm.get("firstname")?.value,
      lastname: this.userForm.get("lastname")?.value,
      phone: this.userForm.get("phone")?.value,
      roles: [],
      garage: this.garage$
    })

  }

  saveUser = () => {

    let user = this.formatUser(new User())

    if (this.state === 'create') {

      this.userService.postUser(user).subscribe({
        next: (res) => {
          this.newuser.emit(user)
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La création du nouveau user est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la création du user`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    } else if (this.state === 'update') {

      this.userService.putUser(user).subscribe({
        next: (res) => {
          this.sameuser.emit(user)
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La modification du user est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la modification du user`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    }
  }

  cancel = () => {

    if (!this.isUpdated) {
      this.stateChange.emit('display')
      this.sameuser.emit(this.user)
      return
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: 'Confirmation',
        message1: `Désirez vous réellement abandonner cette saisie ?`,
        message2: "",
        buttons: ['Oui', 'Non']
      }
    })

    dialogRef.afterClosed().subscribe(result => {

      if (result !== 'Oui')
        return

      this.stateChange.emit('display')
      this.sameuser.emit(this.user)

    })

  }

  get email() { return this.userForm.get('email')! as FormControl }
  get password() { return this.userForm.get('password')! as FormControl }
  get firstname() { return this.userForm.get('firstname')! as FormControl }
  get lastname() { return this.userForm.get('lastname')! as FormControl }
  get phone() { return this.userForm.get('phone')! as FormControl }

}
