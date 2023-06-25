import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Filter } from 'src/app/interface/filter.interface';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-occasions',
  templateUrl: './occasions.component.html',
  styleUrls: ['./occasions.component.scss'],
})
export class OccasionsComponent implements OnInit {

  cars!: Car[]

  filters: Filter[] = [
    {
      name: 'Prix',
      unit: '€',
      inf: 0,
      sup: 100000,
      step: 1000,
      startValue: 0,
      endValue: 100000
    },
    {
      name: 'Kilométrage',
      unit: 'km',
      inf: 0,
      sup: 500000,
      step: 1000,
      startValue: 0,
      endValue: 500000
    },
    {
      name: 'Année',
      unit: '',
      inf: 1950,
      sup: 2023,
      step: 1,
      startValue: 1950,
      endValue: 2023
    },
  ]

  filtre: number = 0

  useBackendImages!: string

  constructor(
    private carService: CarService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.useBackendImages = environment.useBackendImages + '/'
    this.getCars()
  }

  getCars = () => {

    this.carService.getCars().subscribe({
      next: (res) => {
        this.cars = []
        res.forEach((car: Car) => {
          this.cars.push(new Car().deserialize(car))
        })
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

}
