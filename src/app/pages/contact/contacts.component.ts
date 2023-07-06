import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Login } from 'src/app/interface/login.interface';
import { Contact } from 'src/app/models/contact.model';
import { Garage } from 'src/app/models/garage.model';
import { ContactService } from 'src/app/services/contact.service';
import { GarageService } from 'src/app/services/garage.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: [
    './contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  constructor(
    private contactService: ContactService,
    private loginService: LoginService,
    private garageService: GarageService,
    public dialog: MatDialog,
  ) { }

  contacts!: Contact[]
  contactsUpdated: Contact[] = []
  isApprovedDisabled: boolean = false

  login$: Login = {
    email: '',
    roles: []
  }

  garage$!: Garage

  selectedContact!: Contact
  selectedIndex: number = 0
  newContact: Contact = this.contactService.initContact()
  parentState: string = 'display'
  @Input() grandParentState!: string

  ngOnInit(): void {

    this.loginService.listenLogin.subscribe((login) => {
      this.login$ = login as Login
      if (this.login$.roles.indexOf('ROLE_USER') === -1 && this.grandParentState) {
        this.parentState = this.grandParentState
      }
    })
    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})

    this.contactService.getContactsByGarage(this.garage$.id).subscribe({
      next: (res: Contact[]) => {
        this.contacts = res
        this.selectedContact = this.contacts[0]
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la création du service`,
            message2: error.error.message,
            delai: 0
          }
        })
      }

    })
  }

  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'delete']

  dataSource = new MatTableDataSource(this.contacts);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSelectedClass = (index: number) => {
    return this.selectedContact.id === this.contacts[index].id && this.parentState !== 'create' ? "selected" : ""
  }

  isSelectedStyle = (index: number) => {
    return this.selectedContact.id === this.contacts[index].id && this.parentState !== 'create' ? {'background': '#D9777F'} : []
  }

  displayContact = (index: number) => {
    if (this.parentState === 'display') {
      this.selectedContact = this.contacts[index]
    }
  }

  updateContact = (contact: Contact) => {
    if (['update', 'create'].indexOf(this.parentState) < 0) {
      this.selectedContact = contact
      this.parentState = 'update'
    }
  }

  deleteContact = (contact: Contact) => {
    if (['update', 'create'].indexOf(this.parentState) < 0) {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          type: 'Confirmation',
          message1: `Désirez vous réellement supprimer cet utilisateur ?`,
          message2: "",
          buttons: ['Supprimer', 'Annuler']
        }
      })

      dialogRef.afterClosed().subscribe(result => {

        if (result !== 'Supprimer')
          return

        this.selectedContact = contact
        this.parentState = 'delete'

        if (contact.id === 0) {
          this.deleteInDatasource()
          return
        }

        this.contactService.deleteContact(contact.id).subscribe({
          next: (res) => {
            this.deleteInDatasource()
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Information',
                message1: `La suppression du contact est effective !`,
                message2: '',
                delai: 2000
              }
            })
          },
          error: (error: { error: { message: any; }; }) => {
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Erreur',
                message1: `Erreur lors de la suppression du contact`,
                message2: error.error.message,
                delai: 0
              }
            })
          }
        })
      })
    }
  }

  deleteInDatasource = () => {
    const index = this.contacts.findIndex(contact => contact.id === this.selectedContact.id)
    this.contacts.splice(index, 1)
    this.updateDatasource()
    if (this.contacts.length === 0)
      this.selectedContact = this.contactService.initContact()
    else
      this.selectedContact = index > this.contacts.length - 1 ? this.contacts[index -1] : this.contacts[index]
    this.parentState = 'display'
  }

  onNewcontact = (contact: Contact) => {
    this.contacts.push(contact);
    this.selectedContact = this.contacts[this.contacts.length - 1]
    this.updateDatasource()
    if (this.login$.roles.indexOf('ROLE_USER') === -1 && this.grandParentState) {
      this.selectedContact = this.contactService.initContact()
    } else {
      this.parentState = 'display'
    }
  }

  onSamecontact = (contact: Contact) => {
    if (this.login$.roles.indexOf('ROLE_USER') === -1 && this.grandParentState) {
      this.selectedContact = this.contactService.initContact()
      this.parentState = 'create'
    } else {
      this.contacts[this.contacts.findIndex(contact => contact.id === this.selectedContact.id)] = contact
      this.selectedContact = contact
      this.updateDatasource()
      this.parentState = 'display'
    }
  }

  createContact = () => {
    this.parentState = 'create'
  }

  updateDatasource = () => {
    let newContacts: Contact[] = []
    this.contacts.forEach(contact => newContacts.push(contact))
    this.contacts = newContacts
    this.dataSource.connect().next(this.contacts)
  }

  contactsUpdate = (contact: Contact) => {
    if (this.contactsUpdated.find(c => c.id === contact.id) === undefined) {
      this.contactsUpdated.push(contact)
    }
  }

  updateApproved = () => {

    this.contactsUpdated.forEach(contact =>
      this.contactService.putContact(contact).subscribe({
        next: (res) => {
          this.contactsUpdated = []
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
    }))

  }
}
