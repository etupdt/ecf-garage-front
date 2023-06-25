import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Photo } from 'src/app/interface/photo.interface';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';
import { environment } from 'src/environments/environment';
import { Image as MImage } from 'src/app/models/image.model';

@Component({
  selector: 'app-occasion',
  templateUrl: './occasion.component.html',
  styleUrls: ['./occasion.component.scss']
})
export class OccasionComponent {

  car!: Car

  images: Photo[] = []

  useBackendImages!: string

  constructor (
    private carService: CarService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.useBackendImages = environment.useBackendImages + '/'
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getCar(+params.get('id')!);
    })
  }

  getCar = (id: number) => {

    this.carService.getCar(id).subscribe({
      next: (res) => {
        this.car = new Car().deserialize(res)
        this.images.push({
          index: 0,
          image:  new MImage().deserialize({
            id: this.car.image.id,
            filename: this.car.image.filename,
            hash: this.car.image.hash
          } as MImage)
        })
        this.car.images.forEach(image => {
          this.images.push({
            index: 0,
            image: new MImage().deserialize({
              id: image.id,
              filename: image.filename,
              hash: image.hash
            } as MImage)
          })
        })
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la recherche de la voiture`,
            message2: error.error.message,
            delai: 0
          }
        })
      }

    })
  }

  onPhotoSelected = (photo: Photo) => {
    this.car.image = photo.image
  }

}
