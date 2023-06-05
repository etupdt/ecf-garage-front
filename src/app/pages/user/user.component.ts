import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [
    './user.component.scss',
    '../../app.component.scss'
  ]
})
export class UserComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    ) {
      this.user = new User().deserialize({
        id: 0,
      email: 'fsh',
      password: '',
      roles: [],
      firstname: '',
      lastname: '',
      phone: '',
    })
  }

  ngOnInit(): void {
    this.initForm(new User().deserialize({
      id: 0,
      email: 'fsh',
      password: '',
      roles: [],
      firstname: '',
      lastname: '',
      phone: '',
    }))
  }

  @Input() user!: User
  @Output() userChange: EventEmitter<User> = new EventEmitter();
  @Output() userAdd: EventEmitter<User> = new EventEmitter();
  @Input() state: string = "display"
  @Output() stateChange: EventEmitter<string> = new EventEmitter();

  lastUser!: User

  userForm!: FormGroup

  isUpdated = false

  initForm = (user: User) => {

    if (user) {

      this.userForm = this.formBuilder.group({
        id: [user.id],
        email: [user.email, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
        password: [user.password, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
        firstname: [user.firstname, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{2,}/)]],
        lastname: [user.lastname, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{2,}/)]],
        phone: [user.phone, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
      })

      switch (this.state) {
        case 'display' : {
          this.userForm.disable()
          break
        }
        case 'update' : {
          this.userForm.enable()
          break
        }
        case 'create' : {
          this.userForm.enable()
          break
        }
      }

      this.userForm.valueChanges.subscribe(change => {
        this.isUpdated = this.checkChanges()
      })

      this.isUpdated = false

    }

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('onChangesUser')
    if (this.state === 'create') {
      this.initForm(new User().deserialize({
        id: 0,
        email: '',
        password: '',
        roles: [],
        firstname: '',
        lastname: '',
        phone: '',
      })
    )} else {
      this.initForm(this.user)
    }
  }

  checkChanges(): boolean {

    this.isUpdated = this.user.email !== this.userForm.get("email")!.value ||
      this.user.password !== this.userForm.get("password")!.value ||
      this.user.firstname !== this.userForm.get("firstname")!.value ||
      this.user.lastname !== this.userForm.get("lastname")!.value ||
      this.user.phone !== this.userForm.get("phone")!.value

    return this.isUpdated

  }

  saveUser = () => {
    if (this.state === 'create') {
//      alert('saveUser ' + this.state)
      this.userAdd.emit(this.user)
    }
  }

  cancel = () => {
    this.stateChange.emit('display')
    this.userChange.emit(this.user)
  }

}
