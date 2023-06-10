import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Service } from '../models/service.model';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    private http: HttpClient,
    private imageService: ImageService
  ) { }

  initService = () => {
    return new Service().deserialize({
      id: 0,
      name: '',
      description: '',
      image: this.imageService.initImage()
    } as Service)
  }

  getServices(): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/service`
    )

  }

  putService(service: FormData): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/service`,
      service
    )

  }

  postService(service: FormData): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/service/0`,
      service
    )

  }

  deleteService(id: number): Observable<any>{

    return this.http.delete(
      environment.useBackend + `/api/service/${id}`
    )

  }

}
