import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Option } from '../models/option.model';

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  constructor(
    private http: HttpClient
  ) { }

  initOption = () => {
    return new Option().deserialize({
      id: 0,
      name: '',
      description: '',
    } as Option)
  }

  getOptions(): Observable<any> {

    return this.http.get(
      environment.useBackend + `/api/option`
    )

  }

  putOption(option: Option): Observable<any> {

    return this.http.put(
      environment.useBackend + `/api/option/${option.id}`,
      option
    )

  }

  postOption(option: Option): Observable<any> {

    return this.http.post(
      environment.useBackend + `/api/option`,
      option
    )

  }

  deleteOption(id: number): Observable<any>{

    return this.http.delete(
      environment.useBackend + `/api/option/${id}`
    )

  }

}
