import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Garage } from 'src/app/models/garage.model';
import { GarageService } from 'src/app/services/garage.service';

@Component({
  selector: 'app-garages',
  templateUrl: './garages.component.html',
  styleUrls: [
    './garages.component.scss']
})
export class GaragesComponent implements OnInit {

  constructor(
    private garageService: GarageService,
    public dialog: MatDialog,
  ) { }

  garages: Garage[] = []

  selectedGarage!: Garage
  selectedIndex: number = 0
  newGarage!: Garage
  parentState: string = 'display'

  ngOnInit(): void {

    this.garageService.getGarageById(6).subscribe({
      next: (res: Garage) => {
        this.garages = []
        this.garages.push(new Garage().deserialize(res))
        this.selectedGarage = this.garages[0]
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la recherche du garage`,
            message2: error.error.message,
            delai: 0
          }
        })
      }

    })
  }

  displayedColumns: string[] = ['raison', 'address1', 'zip', 'locality', 'update']         //, 'delete']
  dataSource = new MatTableDataSource(this.garages);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSelected = (index: number) => {
    return this.selectedGarage.raison === this.garages[index].raison && this.parentState !== 'create' ? "selected" : ""
  }

  displayGarage = (index: number) => {
    if (this.parentState === 'display') {
      this.selectedGarage = this.garages[index]
    }
  }

  updateGarage = (garage: Garage) => {
    if (['update', 'create'].indexOf(this.parentState) < 0) {
      this.selectedGarage = garage
      this.parentState = 'update'
    }
  }

  deleteGarage = (garage: Garage) => {
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

        this.selectedGarage = garage
        this.parentState = 'delete'

        if (garage.id === 0) {
          this.deleteInDatasource()
          return
        }

        this.garageService.deleteGarage(garage.id).subscribe({
          next: (res) => {
            this.deleteInDatasource()
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Information',
                message1: `La suppression du garage est effective !`,
                message2: '',
                delai: 2000
              }
            })
          },
          error: (error: { error: { message: any; }; }) => {
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Erreur',
                message1: `Erreur lors de la suppression du garage`,
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
    const index = this.garages.findIndex(garage => garage.id === this.selectedGarage.id)
    this.garages.splice(index, 1)
    this.updateDatasource()
    this.selectedGarage = index > this.garages.length - 1 ? this.garages[index -1] : this.garages[index]
    this.parentState = 'display'
  }

  onNewgarage = (garage: Garage) => {
    this.garages.push(garage);
    this.selectedGarage = this.garages[this.garages.length - 1]
    this.updateDatasource()
    this.parentState = 'display'
  }

  onSamegarage = (garage: Garage) => {
    this.garages[this.garages.findIndex(garage => garage.id === this.selectedGarage.id)] = garage
    this.selectedGarage = garage
    this.updateDatasource()
    this.parentState = 'display'
  }

  createGarage = () => {
    this.parentState = 'create'
  }

  updateDatasource = () => {
    let newGarages: Garage[] = []
    this.garages.forEach(garage => newGarages.push(garage))
    this.garages = newGarages
    this.dataSource.connect().next(this.garages)
  }

}
