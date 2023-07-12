import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Option } from 'src/app/models/option.model';
import { OptionService } from 'src/app/services/option.service';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: [
    './option.component.scss',
    '../../app.component.scss'
  ]
})
export class OptionComponent implements OnInit {

  @Input() option!: Option
  @Output() sameoption: EventEmitter<Option> = new EventEmitter();
  @Output() newoption: EventEmitter<Option> = new EventEmitter<Option>();
  @Input() state: string = "display"
  @Output() stateChange: EventEmitter<string> = new EventEmitter();

  lastOption!: Option
  optionH3Label: string = ''

  optionForm!: FormGroup

  isUpdated = false

  constructor(
    private formBuilder: FormBuilder,
    private optionService: OptionService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.initForm(this.optionService.initOption())
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.state === 'create') {
      this.initForm(this.optionService.initOption()
    )} else {
      this.initForm(this.option)
    }
  }

  ngOnDestroy(): void {
    this.quit()
  }


  quit = () => {

    if (this.isUpdated && !this.optionForm.invalid) {

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
            this.saveOption()
            break
          }
        }
      });

    }
  }

  initForm = (option: Option) => {

    if (option) {

      this.optionForm = this.formBuilder.group({
        name: [
          option.name,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[a-zA-Z0-9 -éèàêç]*$/)
          ]
        ],
        description: [
          option.description,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/[0-9a-zA-Z -+*_='\/]*$/),
          ]
        ],
      })

      this.optionH3Label = this.option ? `Option ${this.option.name}` : ''

      switch (this.state) {
        case 'display' : {
          this.optionForm.disable()
          break
        }
        case 'update' : {
          this.optionForm.enable()
          break
        }
        case 'create' : {
          this.optionForm.enable()
          this.optionH3Label = 'Nouvelle option'
          break
        }
      }

      this.optionForm.valueChanges.subscribe(change => {
        this.isUpdated = this.checkChanges()
      })

      this.isUpdated = false

    }

  }

  checkChanges(): boolean {

    this.isUpdated = this.option?.name !== this.optionForm.get("name")!.value ||
      this.option?.description !== this.optionForm.get("description")!.value

    return this.isUpdated

  }

  formatOption = (option: Option): Option => {

    return option.deserialize({
      id: this.option ? this.option.id : 0,
      name: this.optionForm.get("name")?.value,
      description: this.optionForm.get("description")?.value,
    })

  }

  saveOption = () => {

    let option = this.formatOption(new Option())

    if (this.state === 'create') {

      this.optionService.postOption(option).subscribe({
        next: (res) => {
          this.newoption.emit(new Option().deserialize(res))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La création du nouveau option est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la création du option`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    } else if (this.state === 'update') {

      this.optionService.putOption(option).subscribe({
        next: (res) => {
          this.sameoption.emit(new Option().deserialize(res))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La modification du option est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la modification du option`,
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
      this.sameoption.emit(this.option)
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
      this.sameoption.emit(this.option)

    })

  }

  get name() { return this.optionForm.get('name')! as FormControl }
  get description() { return this.optionForm.get('description')! as FormControl }

}
