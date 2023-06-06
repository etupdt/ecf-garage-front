import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: [
    './users.component.scss',
    '../../app.component.scss'
  ]
})
export class UsersComponent implements OnInit {

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
  ) { }

  users!: User[]

  selectedUser!: User
  selectedIndex: number = 0
  newUser!: User
  parentState: string = 'display'

  ngOnInit(): void {

    this.userService.getUsers().subscribe({
      next: (res: User[]) => {
        this.users = res
        this.selectedUser = this.users[0]
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

  displayedColumns: string[] = ['email', 'firstname', 'lastname', 'phone', 'update', 'delete']
  dataSource = new MatTableDataSource(this.users);

  applyFilter(event: Event) {
    console.log((event.target as HTMLInputElement).value)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSelected = (index: number) => {
    return this.selectedUser.email === this.users[index].email && this.parentState !== 'create' ? "selected" : ""
  }

  displayUser = (index: number) => {
    if (this.parentState === 'display') {
      this.selectedUser = this.users[index]
    }
  }

  updateUser = (user: User) => {
    if (['update', 'create'].indexOf(this.parentState) < 0) {
      this.selectedUser = user
      this.parentState = 'update'
    }
  }

  deleteUser = (user: User) => {
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

        this.selectedUser = user
        this.parentState = 'delete'

        if (user.id === 0) {
          this.deleteInDatasource()
          return
        }

        this.userService.deleteUser(user.id).subscribe({
          next: (res) => {
            this.deleteInDatasource()
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Information',
                message1: `La suppression du user est effective !`,
                message2: '',
                delai: 2000
              }
            })
          },
          error: (error: { error: { message: any; }; }) => {
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Erreur',
                message1: `Erreur lors de la suppression du user`,
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
    const index = this.users.findIndex(user => user.id === this.selectedUser.id)
    this.users.splice(index, 1)
    this.updateDatasource()
    this.selectedUser = index > this.users.length - 1 ? this.users[index -1] : this.users[index]
    this.parentState = 'display'
  }

  onNewuser = (user: User) => {
    this.users.push(user);
    this.selectedUser = this.users[this.users.length - 1]
    this.updateDatasource()
    this.parentState = 'display'
  }

  onSameuser = (user: User) => {
    this.users[this.users.findIndex(user => user.id === this.selectedUser.id)] = user
    this.selectedUser = user
    this.updateDatasource()
    this.parentState = 'display'
  }

  createUser = () => {
    this.parentState = 'create'
  }

  updateDatasource = () => {
    let newUsers: User[] = []
    this.users.forEach(user => newUsers.push(user))
    this.users = newUsers
    this.dataSource.connect().next(this.users)
  }

}
