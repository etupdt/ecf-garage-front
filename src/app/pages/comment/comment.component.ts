import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Login } from 'src/app/interface/login.interface';
import { Comment } from 'src/app/models/comment.model';
import { Garage } from 'src/app/models/garage.model';
import { CommentService } from 'src/app/services/comment.service';
import { GarageService } from 'src/app/services/garage.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: [
    './comment.component.scss',
    '../../app.component.scss'
  ]
})
export class CommentComponent implements OnInit {

  @Input() comment!: Comment
  @Output() samecomment: EventEmitter<Comment> = new EventEmitter();
  @Output() newcomment: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Input() state: string = "display"
  @Output() stateChange: EventEmitter<string> = new EventEmitter();

  @Input() fromHome: boolean = false

  lastComment!: Comment
  commentH3Label: string = ''

  commentForm!: FormGroup

  isUpdated = false

  login$: Login = {
    email: '',
    roles: []
  }

  garage$!: Garage

  sizeTable = 4

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private garageService: GarageService,
    private loginService: LoginService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    this.sizeTable = window.innerWidth <= 800 ? 2 : 4;

    this.loginService.listenLogin.subscribe((login) => {this.login$ = login as Login})
    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})

    this.comment = this.commentService.initComment()

    this.initForm(this.comment)

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.state === 'create') {
      this.initForm(this.commentService.initComment()
    )} else {
      this.initForm(this.comment)
    }
  }

  ngOnDestroy(): void {
    this.quit()
  }

  quit = () => {

    if (this.isUpdated && !this.commentForm.invalid) {

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
            this.saveComment()
            break
          }
        }
      });

    }
  }

  initForm = (comment: Comment) => {

    if (comment) {

      this.commentForm = this.formBuilder.group({
        id: [{value: comment.id, disabled: true}],
        firstname: [
          comment.firstname, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(32),
            Validators.pattern(/^[a-zA-Z -éèàêç]*$/)
          ]
        ],
        lastname: [
          comment.lastname, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(32),
            Validators.pattern(/^[a-zA-Z -éèàêç]*$/)
          ]
        ],
        comment: [
          comment.comment, [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/[0-9a-zA-Z -+*_='\/]*$/),
          ]
        ],
        note: [
          comment.note, [
            Validators.required,
            Validators.min(1),
            Validators.max(5)
          ]
        ]
      })

      this.commentH3Label = this.comment ? `Commentaire de ${this.comment.firstname} ${this.comment.lastname}` : 'Commentaire'

      this.commentForm.disable()

      switch (this.state) {
        case 'update' : {
          if (this.login$.roles.indexOf('ROLE_USER') < 0) {
            this.commentForm.enable()
          }
          break
        }
        case 'create' : {
          this.commentForm.enable()
          this.commentH3Label = 'Nouveau commentaire'
          break
        }
      }

      this.commentForm.valueChanges.subscribe(change => {
        this.isUpdated = this.checkChanges()
      })

      this.isUpdated = false

    }

  }

  checkChanges(): boolean {

    this.isUpdated = this.comment?.firstname !== this.commentForm.get("firstname")!.value ||
    this.comment?.lastname !== this.commentForm.get("lastname")!.value ||
    this.comment?.comment !== this.commentForm.get("comment")!.value ||
    this.commentForm.get("note")!.value !== 0 ||
    this.comment?.isApproved !== this.commentForm.get("isApproved")!.value ||
    this.state === 'update'

    return this.isUpdated

  }

  formatComment = (comment: Comment): Comment => {

    return comment.deserialize({
      id: this.comment ? this.comment.id : 0,
      firstname: this.commentForm.get("firstname")?.value,
      lastname: this.commentForm.get("lastname")?.value,
      comment: this.commentForm.get("comment")?.value,
      note: this.commentForm.get("note")!.value,
      isApproved: this.commentForm.get("comment")?.value === true,
      garage: this.garage$
    })

  }

  saveComment = () => {

    let comment = this.formatComment(new Comment())

    if (this.state === 'create') {

      this.commentService.postComment(comment).subscribe({
        next: (res) => {
          this.newcomment.emit(new Comment().deserialize(res))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La création du nouveau comment est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la création du comment`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    } else if (this.state === 'update') {

      this.commentService.putComment(comment).subscribe({
        next: (res) => {
          this.samecomment.emit(new Comment().deserialize(res[0]))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La modification du comment est effective !`,
              message2: '',
              delai: 2000
            }
          })
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

      })

    }
  }

  cancel = () => {

    if (!this.isUpdated) {
      this.stateChange.emit('display')
      this.samecomment.emit(this.comment)
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
      this.samecomment.emit(this.comment)

    })

  }

  onResizeTable = (event: UIEvent) => {
    this.sizeTable = ((event.target! as Window).innerWidth <= 800) ? 2 : 4;
  }

  get firstname() { return this.commentForm.get('firstname')! as FormControl }
  get lastname() { return this.commentForm.get('lastname')! as FormControl }
  get getComment() { return this.commentForm.get('comment')! as FormControl }
  get note() { return this.commentForm.get('note')! as FormControl }

}
