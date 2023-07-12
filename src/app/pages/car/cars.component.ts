import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Filter } from 'src/app/interface/filter.interface';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: [
    './cars.component.scss']
})
export class CarsComponent implements OnInit {

  constructor(
    private carService: CarService,
    public dialog: MatDialog,
  ) {}

  cars!: Car[]

  selectedCar!: Car
  selectedIndex: number = 0
  newCar: Car = this.carService.initCar()
  parentState: string = 'display'

  ngOnInit(): void {

    this.carService.getCars().subscribe({
      next: (res: Car[]) => {
        this.cars = res
        this.selectedCar = this.cars[0]
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la lecture des voitures`,
            message2: error.error.message,
            delai: 0
          }
        })
      }

    })
  }

  displayedColumns: string[] = ['brand', 'model', 'price', 'year', 'kilometer', 'update', 'delete']
  dataSource = new MatTableDataSource(this.cars);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSelectedClass = (index: number) => {
    return this.selectedCar.id === this.cars[index].id && this.parentState !== 'create' ? "selected" : ""
  }

  isSelectedStyle = (index: number) => {
    return this.selectedCar.id === this.cars[index].id && this.parentState !== 'create' ? {'background': '#D9777F'} : []
  }

  displayCar = (index: number) => {
    if (this.parentState === 'display') {
      this.selectedCar = this.cars[index]
    }
  }

  updateCar = (car: Car) => {
    if (['update', 'create'].indexOf(this.parentState) < 0) {
      this.selectedCar = car
      this.parentState = 'update'
    }
  }

  deleteCar = (car: Car) => {

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

        this.selectedCar = car
        this.parentState = 'delete'

        if (car.id === 0) {
          this.deleteInDatasource()
          return
        }

        this.carService.deleteCar(car.id).subscribe({
          next: (res) => {
            this.deleteInDatasource()
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Information',
                message1: `La suppression du car est effective !`,
                message2: '',
                delai: 2000
              }
            })
          },
          error: (error: { error: { message: any; }; }) => {
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Erreur',
                message1: `Erreur lors de la suppression du car`,
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
    const index = this.cars.findIndex(car => car.id === this.selectedCar.id)
    this.cars.splice(index, 1)
    this.updateDatasource()
    if (this.cars.length === 0)
      this.selectedCar = this.carService.initCar()
    else
      this.selectedCar = index > this.cars.length - 1 ? this.cars[index -1] : this.cars[index]
    this.parentState = 'display'
  }

  onNewcar = (car: Car) => {
    this.cars.push(car);
    this.selectedCar = this.cars[this.cars.length - 1]
    this.updateDatasource()
    this.parentState = 'display'
  }

  onSamecar = (car: Car) => {
    if (!car) {
      this.selectedCar = this.cars[0]
      return
    }
    this.cars[this.cars.findIndex(car => car.id === this.selectedCar.id)] = car
    this.selectedCar = car
    this.updateDatasource()
    this.parentState = 'display'
  }

  createCar = () => {
    this.selectedCar = this.carService.initCar()
    this.parentState = 'create'
  }

  updateDatasource = () => {
    let newCars: Car[] = []
    this.cars.forEach(car => newCars.push(car))
    this.cars = newCars
    this.dataSource.connect().next(this.cars)
  }

}
