import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contact } from '../models/contact.model';
import { Garage } from '../models/garage.model';
import { GarageService } from './garage.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http: HttpClient,
    private garageService: GarageService
  ) {
    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})
  }

  garage$!: Garage

  initContact = () => {
    return new Contact().deserialize({
      id: 0,
      subject: '',
      firstname: '',
      lastname: '',
      message: '',
      email: '',
      phone: '',
      garage: this.garage$
    } as Contact)
  }

  getContacts(): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/contact`
    )

  }

  getContactsByGarage(garage_id: number): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/contact/garage/${garage_id}`
    )

  }

  putContact(contact: Contact): Observable<any> {

    return this.http.put(
      environment.useBackend + `/api/contact/${contact.id}`,
      contact
    )

  }

  postContact(contact: Contact): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/contact`,
      contact
    )

  }

  deleteContact(id: number): Observable<any>{

    return this.http.delete(
      environment.useBackend + `/api/contact/${id}`
    )

  }

}
