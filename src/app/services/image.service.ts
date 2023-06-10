import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Image } from '../models/image.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private http: HttpClient
  ) { }

  initImage = () => {
    return new Image().deserialize({
      id: 0,
      filename: '',
      hash: ''
    } as Image  )
}

}
