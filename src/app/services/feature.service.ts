import { Injectable } from '@angular/core';
import { Feature } from '../models/feature.model';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor() { }

  initFeature = () => {
    return new Feature().deserialize({
      id: 0,
      name: '',
      description: '',
    } as Feature)
  }

}
