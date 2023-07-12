import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Option } from 'src/app/models/option.model';
import { OptionService } from 'src/app/services/option.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: [
    './options.component.scss']
})
export class OptionsComponent implements OnInit {

  constructor(
    private optionService: OptionService,
    public dialog: MatDialog,
  ) { }

  options!: Option[]

  selectedOption!: Option
  selectedIndex: number = 0
  newOption: Option = this.optionService.initOption()
  parentState: string = 'display'

  ngOnInit(): void {

    this.optionService.getOptions().subscribe({
      next: (res: Option[]) => {
        this.options = res
        this.selectedOption = this.options[0]
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la lecture des options`,
            message2: error.error.message,
            delai: 0
          }
        })
      }

    })
  }

  displayedColumns: string[] = ['name', 'description', 'update', 'delete']
  dataSource = new MatTableDataSource(this.options);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSelectedClass = (index: number) => {
    return this.selectedOption.id === this.options[index].id && this.parentState !== 'create' ? "selected" : ""
  }

  isSelectedStyle = (index: number) => {
    return this.selectedOption.id === this.options[index].id && this.parentState !== 'create' ? {'background': '#D9777F'} : []
  }

  displayOption = (index: number) => {
    if (this.parentState === 'display') {
      this.selectedOption = this.options[index]
    }
  }

  updateOption = (option: Option) => {
    if (['update', 'create'].indexOf(this.parentState) < 0) {
      this.selectedOption = option
      this.parentState = 'update'
    }
  }

  deleteOption = (option: Option) => {
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

        this.selectedOption = option
        this.parentState = 'delete'

        if (option.id === 0) {
          this.deleteInDatasource()
          return
        }

        this.optionService.deleteOption(option.id).subscribe({
          next: (res) => {
            this.deleteInDatasource()
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Information',
                message1: `La suppression du option est effective !`,
                message2: '',
                delai: 2000
              }
            })
          },
          error: (error: { error: { message: any; }; }) => {
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Erreur',
                message1: `Erreur lors de la suppression du option`,
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
    const index = this.options.findIndex(option => option.id === this.selectedOption.id)
    this.options.splice(index, 1)
    this.updateDatasource()
    if (this.options.length === 0)
      this.selectedOption = this.optionService.initOption()
    else
      this.selectedOption = index > this.options.length - 1 ? this.options[index -1] : this.options[index]
    this.parentState = 'display'
  }

  onNewoption = (option: Option) => {
    this.options.push(option);
    this.selectedOption = this.options[this.options.length - 1]
    this.updateDatasource()
    this.parentState = 'display'
  }

  onSameoption = (option: Option) => {
    this.options[this.options.findIndex(option => option.id === this.selectedOption.id)] = option
    this.selectedOption = option
    this.updateDatasource()
    this.parentState = 'display'
  }

  createOption = () => {
    this.parentState = 'create'
  }

  updateDatasource = () => {
    let newOptions: Option[] = []
    this.options.forEach(option => newOptions.push(option))
    this.options = newOptions
    this.dataSource.connect().next(this.options)
  }

}
