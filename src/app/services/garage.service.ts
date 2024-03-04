import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Garage } from '../models/garage.model';
import { MessageDialogComponent } from '../dialogs/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class GarageService {

  garageInit = new Garage().deserialize({
    id: 0,
    raison: '',
    phone: '',
    address1: '',
    address2: '',
    zip: '',
    locality: '',
    day1hours: '',
    day2hours: '',
    day3hours: '',
    day4hours: '',
    day5hours: '',
    day6hours: '',
    day7hours: '',
    comments: [],
    cars: [],
    services: []
  })

  garage: BehaviorSubject<Garage> = new BehaviorSubject<Garage>(this.garageInit)
  listenGarage = this.garage.asObservable()

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
  ) {
    this.getGarageByRaison('Garage Vincent Parrot').subscribe({
      next: (res: Garage) => {
        this.garage.next(new Garage().deserialize(res))
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la recherche du garage Vincent Parrot`,
            message2: error.error.message,
            delai: 0
          }
        })
      }

    })
  }

  initGarage = () => {
    return this.garageInit
  }

  getGarageById(id: number): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/garage/${id}`
    )

  }

  putGarage(garage: Garage): Observable<any> {

    return this.http.put(
      environment.useBackend + `/api/garage/${garage.id}`,
      garage
    )

  }

  postGarage(garage: Garage): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/garage`,
      garage
    )

  }

  getGarageByRaison(raison: string): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/garage/raison`,
      {raison: raison},
      // { 
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json',
      //     'Access-Control-Request-Headers': 'X-Requested-With'
      //   })
      // }
    )

  }

  deleteGarage(id: number): Observable<any>{

    return this.http.delete(
      environment.useBackend + `/api/garage/${id}`
    )

  }

}
