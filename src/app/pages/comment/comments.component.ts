import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Login } from 'src/app/interface/login.interface';
import { Comment } from 'src/app/models/comment.model';
import { Garage } from 'src/app/models/garage.model';
import { CommentService } from 'src/app/services/comment.service';
import { GarageService } from 'src/app/services/garage.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: [
    './comments.component.scss']
})
export class CommentsComponent implements OnInit {

  constructor(
    private commentService: CommentService,
    private loginService: LoginService,
    private garageService: GarageService,
    public dialog: MatDialog,
  ) { }

  comments!: Comment[]
  commentsUpdated: Comment[] = []
  isApprovedDisabled: boolean = false

  login$: Login = {
    email: '',
    roles: []
  }

  garage$!: Garage

  selectedComment!: Comment
  selectedIndex: number = 0
  newComment: Comment = this.commentService.initComment()
  parentState: string = 'display'

  fromHome: boolean = false
  @Input() fromParentHome!: boolean

  ngOnInit(): void {
console.log ('this.fromParentHome', this.fromParentHome)
    this.fromHome = this.fromParentHome;
    this.loginService.listenLogin.subscribe((login) => {
      this.login$ = login as Login
      if (this.login$.roles.indexOf('ROLE_USER') === -1 && this.fromParentHome) {
        this.parentState = 'create'
      }
    })

    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})

    this.commentService.getCommentsByGarage(this.garage$.id).subscribe({
      next: (res: Comment[]) => {
        this.comments = res
        this.selectedComment = this.comments[0]
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

  displayedColumns: string[] = ['firstname', 'lastname', 'note', 'isApproved', 'delete']

  dataSource = new MatTableDataSource(this.comments);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSelected = (index: number) => {
    return this.selectedComment.id === this.comments[index].id && this.parentState !== 'create' ? "selected" : ""
  }

  displayComment = (index: number) => {
    if (this.parentState === 'display') {
      this.selectedComment = this.comments[index]
    }
  }

  updateComment = (comment: Comment) => {
    if (['update', 'create'].indexOf(this.parentState) < 0) {
      this.selectedComment = comment
      this.parentState = 'update'
    }
  }

  deleteComment = (comment: Comment) => {
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

        this.selectedComment = comment
        this.parentState = 'delete'

        if (comment.id === 0) {
          this.deleteInDatasource()
          return
        }

        this.commentService.deleteComment(comment.id).subscribe({
          next: (res) => {
            this.deleteInDatasource()
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Information',
                message1: `La suppression du comment est effective !`,
                message2: '',
                delai: 2000
              }
            })
          },
          error: (error: { error: { message: any; }; }) => {
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Erreur',
                message1: `Erreur lors de la suppression du comment`,
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
    const index = this.comments.findIndex(comment => comment.id === this.selectedComment.id)
    this.comments.splice(index, 1)
    this.updateDatasource()
    if (this.comments.length === 0)
      this.selectedComment = this.commentService.initComment()
    else
      this.selectedComment = index > this.comments.length - 1 ? this.comments[index -1] : this.comments[index]
    this.parentState = 'display'
  }

  onNewcomment = (comment: Comment) => {
    this.comments.push(comment);
    this.selectedComment = this.comments[this.comments.length - 1]
    this.updateDatasource()
    if (this.login$.roles.indexOf('ROLE_USER') === -1 && this.fromParentHome) {
      this.selectedComment = this.commentService.initComment()
    } else {
      this.parentState = 'display'
    }
  }

  onSamecomment = (comment: Comment) => {
    if (this.login$.roles.indexOf('ROLE_USER') === -1 && this.fromParentHome) {
      this.selectedComment = this.commentService.initComment()
      this.parentState = 'create'
    } else {
      this.comments[this.comments.findIndex(comment => comment.id === this.selectedComment.id)] = comment
      this.selectedComment = comment
      this.updateDatasource()
      this.parentState = 'display'
    }
  }

  createComment = () => {
    this.parentState = 'create'
  }

  updateDatasource = () => {
    let newComments: Comment[] = []
    this.comments.forEach(comment => newComments.push(comment))
    this.comments = newComments
    this.dataSource.connect().next(this.comments)
  }

  commentsUpdate = (comment: Comment) => {
    if (this.commentsUpdated.find(c => c.id === comment.id) === undefined) {
      this.commentsUpdated.push(comment)
    }
  }

  updateApproved = () => {

    this.commentsUpdated.forEach(comment =>
      this.commentService.putComment(comment).subscribe({
        next: (res) => {
          this.commentsUpdated = []
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la modification du comment`,
            message2: error.error.message,
            delai: 0
          }
        })
      }
    }))

  }
}
