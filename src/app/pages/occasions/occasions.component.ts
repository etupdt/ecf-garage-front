import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-occasions',
  templateUrl: './occasions.component.html',
  styleUrls: ['./occasions.component.scss'],
})
export class OccasionsComponent implements OnInit {

  cars: Car[] = []

  startValue: number = 0
  endValue: number = 100

  useBackendImages!: string

  constructor(
    private carService: CarService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.useBackendImages = environment.useBackendImages + '/'
    this.getCars()
  }

  getCars = () => {

    this.carService.getCars().subscribe({
      next: (res) => {
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

  imageChange = (image: string) => {

    let img: HTMLImageElement = new Image()
    img.src = environment.useBackendImages + '/' + image

    img.onload = () => {
      return img.width > img.height ? "image-h" : "image-v"
    }

  }

}
