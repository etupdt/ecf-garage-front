import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Garage } from '../models/garage.model';
import { GarageService } from './garage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private garageService: GarageService
  ) {
    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})
  }

  garage$!: Garage

  initUser = () => {
    return new User().deserialize({
      id: 0,
      email: '',
      password: '',
      roles: [],
      firstname: '',
      lastname: '',
      phone: '',
      garage: this.garage$
    })
  }

  getUsers(): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/user`
    )

  }

  getUsersByGarage(garage_id: number): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/user/garage/${garage_id}`
    )

  }

  postUsersByGarage(garage: Garage): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/user/garage`,
      garage
    )

  }

  putUser(user: User): Observable<any> {

    return this.http.put(
      environment.useBackend + `/api/user/${user.id}`,
      user
    )

  }

  postUser(user: User): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/user`,
      user
    )

  }

  deleteUser(id: number): Observable<any>{

    return this.http.delete(
      environment.useBackend + `/api/user/${id}`
    )

  }

}
