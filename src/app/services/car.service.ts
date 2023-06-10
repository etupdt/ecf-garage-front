import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Car } from '../models/car.model';
import { OptionService } from './option.service';
import { ImageService } from './image.service';
import { GarageService } from './garage.service';
import { Option } from '../models/option.model';
import { Feature } from '../models/feature.model';
import { Image } from '../models/image.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(
    private http: HttpClient,
    private garageService: GarageService,
    private imageService: ImageService
  ) { }

  initCar = () => {
    return new Car().deserialize({
      id: 0,
      brand: '',
      model: '',
      price: 0,
      year: 0,
      kilometer: 0,
      description: '',
      options: [] as Option[],
      features: [] as Feature[],
      garage: this.garageService.initGarage(),
      image: this.imageService.initImage(),
      images: [] as Image[]
    } as Car)
  }

  getCars(): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/car`
    )

  }

  putCar(car: FormData): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/car/${car.get('id')}`,
      car
    )

  }

  postCar(car: FormData): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/car`,
      car
    )

  }

  deleteCar(id: number): Observable<any>{

    return this.http.delete(
      environment.useBackend + `/api/car/${id}`
    )

  }

}
