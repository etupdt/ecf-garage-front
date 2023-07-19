import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Login } from 'src/app/interface/login.interface';
import { Contact } from 'src/app/models/contact.model';
import { Garage } from 'src/app/models/garage.model';
import { ContactService } from 'src/app/services/contact.service';
import { GarageService } from 'src/app/services/garage.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: [
    './contact.component.scss',
    '../../app.component.scss'
  ]
})
export class ContactComponent implements OnInit {

  @Input() contact!: Contact
  @Output() samecontact: EventEmitter<Contact> = new EventEmitter();
  @Output() newcontact: EventEmitter<Contact> = new EventEmitter<Contact>();
  @Input() state!: string
  @Output() stateChange: EventEmitter<string> = new EventEmitter();

  @Input() grandParentState!: string
  @Input() initSubject!: string

  header: boolean = false;

  lastContact!: Contact
  contactH3Label: string = ''

  contactForm!: FormGroup

  note = 0
  isUpdated = false

  login$: Login = {
    email: '',
    roles: []
  }

  garage$!: Garage

  sizeTable = 4

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private garageService: GarageService,
    private loginService: LoginService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    this.sizeTable = window.innerWidth <= 800 ? 2 : 4;

    this.state = this.grandParentState ? this.grandParentState : this.state

    if (!this.state) {
      this.state = 'create'
      this.header = true;
    }

    this.loginService.listenLogin.subscribe((login) => {this.login$ = login as Login})
    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})

    this.contact = this.contactService.initContact()
    this.contact.subject = this.initSubject ? this.initSubject : ''

    this.initForm(this.contact)

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.state === 'create') {
      let contact: Contact = this.contactService.initContact()
      contact.subject = this.initSubject ? this.initSubject : ''
      this.initForm(contact)
    } else {
      this.initForm(this.contact)
    }
  }

  ngOnDestroy(): void {
    this.quit()
  }

  quit = () => {

    if (this.isUpdated && !this.contactForm.invalid) {

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
            this.saveContact()
            break
          }
        }

      });

    }
  }

  initForm = (contact: Contact) => {

    if (contact) {

      this.contactForm = this.formBuilder.group({
        id: [{value: contact.id, disabled: true}],
        subject: [
          contact.subject, [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(/^[a-zA-Z0-9 -éèàêç€]*$/)
          ]
        ],
        firstname: [
          contact.firstname, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(32),
            Validators.pattern(/^[a-zA-Z -éèàêç]*$/)
          ]
        ],
        lastname: [
          contact.lastname, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(32),
            Validators.pattern(/^[a-zA-Z -éèàêç]*$/)
          ]
        ],
        message: [
          contact.message, [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/[0-9a-zA-Z -+*_='\/]*$/),
          ]
        ],
        email: [
          contact.email, [
            Validators.required,
            Validators.email,
            Validators.pattern(/^.{3,}\@.+\..+$/)
          ]
        ],
        phone: [
          contact.phone, [
            Validators.required,
            Validators.pattern(/^(0)[1-9]( \d{2}){4}$/),
          ]
        ],
      })

      this.contactH3Label = this.contact.lastname !== '' ? `Contact de ${this.contact.firstname} ${this.contact.lastname}` : 'Contact'

      this.contactForm.disable()

      switch (this.state) {
        case 'update' : {
          if (this.login$.roles.indexOf('ROLE_USER') < 0) {
            this.contactForm.enable()
          }
          break
        }
        case 'create' : {
          this.contactForm.enable()
          this.contactH3Label = 'Nouveau contact'
          break
        }
      }

      this.contactForm.valueChanges.subscribe(change => {
        this.isUpdated = this.checkChanges()
      })

      this.isUpdated = false

    }

  }

  checkChanges(): boolean {

    this.isUpdated = this.contact?.subject !== this.contactForm.get("subject")!.value ||
    this.contact?.firstname !== this.contactForm.get("firstname")!.value ||
    this.contact?.lastname !== this.contactForm.get("lastname")!.value ||
    this.contact?.message !== this.contactForm.get("message")!.value ||
    this.contact?.email !== this.contactForm.get("email")!.value ||
    this.contact?.phone !== this.contactForm.get("phone")!.value

    return this.isUpdated

  }

  formatContact = (contact: Contact): Contact => {

    return contact.deserialize({
      id: this.contact ? this.contact.id : 0,
      subject: this.contactForm.get("subject")?.value,
      firstname: this.contactForm.get("firstname")?.value,
      lastname: this.contactForm.get("lastname")?.value,
      message: this.contactForm.get("message")?.value,
      email: this.contactForm.get("email")?.value,
      phone: this.contactForm.get("phone")?.value,
      garage: this.garage$
    })

  }

  saveContact = () => {

    let contact = this.formatContact(new Contact())

    if (!this.state || this.state === 'create') {

      this.contactService.postContact(contact).subscribe({
        next: (res) => {
          const contact = new Contact().deserialize(res)
          if (this.initSubject || this.header) {
            this.isUpdated = false
            let contact: Contact = this.contactService.initContact()
            contact.subject = this.initSubject ? this.initSubject : ''
            this.initForm(contact)
          } else {
            this.newcontact.emit(contact)
          }
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La création du nouveau contact est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: {message: string} }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la création du contact`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    } else if (this.state === 'update') {

      this.contactService.putContact(contact).subscribe({
        next: (res) => {
          this.samecontact.emit(new Contact().deserialize(res[0]))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La modification du contact est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la modification du contact`,
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
      this.samecontact.emit(this.contact)
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

      if (result !== 'Oui') {
        return
      }

      if (this.initSubject || this.header) {
        let contact: Contact = this.contactService.initContact()
        contact.subject = this.initSubject ? this.initSubject : ''
        this.initForm(contact)
      } else {
        this.stateChange.emit('display')
        this.samecontact.emit(this.contact)
      }

    })

  }

  onResizeTable = (event: UIEvent) => {
    this.sizeTable = ((event.target! as Window).innerWidth <= 800) ? 2 : 4;
  }

  get subject() { return this.contactForm.get('subject')! as FormControl }
  get firstname() { return this.contactForm.get('firstname')! as FormControl }
  get lastname() { return this.contactForm.get('lastname')! as FormControl }
  get email() { return this.contactForm.get('email')! as FormControl }
  get phone() { return this.contactForm.get('phone')! as FormControl }
  get message() { return this.contactForm.get('message')! as FormControl }

}
