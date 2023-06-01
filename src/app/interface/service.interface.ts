import { Image } from '../models/image.model'

export interface IService {

  id: number
  name: string
  description: string
  image: Image

  serialize?: Function
  deserialize?: Function

}
