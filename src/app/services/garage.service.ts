import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Garage } from '../models/garage.model';

@Injectable({
  providedIn: 'root'
})
export class GarageService {

  constructor(
    private http: HttpClient
  ) { }

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

  deleteGarage(id: number): Observable<any>{

    return this.http.delete(
      environment.useBackend + `/api/garage/${id}`
    )

  }

}
