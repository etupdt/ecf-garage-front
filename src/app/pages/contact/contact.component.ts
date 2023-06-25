import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @Input() state: string = "display"
  @Output() stateChange: EventEmitter<string> = new EventEmitter();

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

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private garageService: GarageService,
    private loginService: LoginService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    this.loginService.listenLogin.subscribe((login) => {this.login$ = login as Login})
    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})

    this.contact = this.contactService.initContact()

    this.initForm(this.contact)

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('onChangesContact')
    if (this.state === 'create') {
      this.initForm(this.contactService.initContact()
    )} else {
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
        firstname: [contact.firstname, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
        lastname: [contact.lastname, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
        message: [contact.message, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
        email: [contact.email, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
        phone: [contact.phone, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
      })

      this.contactH3Label = this.contact ? `Contact de ${this.contact.firstname} ${this.contact.lastname}` : ''

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
          this.contactH3Label = 'Nouveau contactaire'
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

    this.isUpdated = this.contact?.firstname !== this.contactForm.get("firstname")!.value ||
    this.contact?.lastname !== this.contactForm.get("lastname")!.value ||
    this.contact?.message !== this.contactForm.get("message")!.value ||
    this.contact?.email !== this.contactForm.get("email")!.value ||
    this.contact?.phone !== this.contactForm.get("phone")!.value

    return this.isUpdated

  }

  formatContact = (contact: Contact): Contact => {

    return contact.deserialize({
      id: this.contactForm.get("id")?.value,
      firstname: this.contactForm.get("firstname")?.value,
      lastname: this.contactForm.get("lastname")?.value,
      contact: this.contactForm.get("contact")?.value,
      note: this.note,
      isApproved: this.contactForm.get("contact")?.value === true,
      garage: this.garage$
    })

  }

  saveContact = () => {

    let contact = this.formatContact(new Contact())

    if (this.state === 'create') {

      this.contactService.postContact(contact).subscribe({
        next: (res) => {
          this.newcontact.emit(new Contact().deserialize(res))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La création du nouveau contact est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
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

      if (result !== 'Oui')
        return

      this.stateChange.emit('display')
      this.samecontact.emit(this.contact)

    })

  }

}
