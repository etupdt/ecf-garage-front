import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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
    public dialog: MatDialog
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

  displayedColumns: string[] = ['id', 'email', 'firstname', 'lastname', 'phone', 'update', 'delete']
  dataSource = new MatTableDataSource(this.users);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSelected = (index: number) => {
    return this.selectedUser.id === this.users[index].id ? "selected" : ""
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
      this.selectedUser = user
      this.parentState = 'delete'
    }
  }

  onNewUser = (user: User) => {
    console.log('save user parent ')
    this.users.push(this.selectedUser)
    this.selectedIndex = this.users.length - 1
  }

  createUser = () => {
    this.parentState = 'create'
  }

}
