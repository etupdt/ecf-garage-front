import { IService } from "../interface/service.interface";
import { Image } from "../models/image.model";

export class Service implements IService {

  id!: number;
  name!: string;
  description!: string;
  image!: Image;

  constructor()
  {
/*    console.log(data.image)
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.image = data.image*/
  }

  toString() {
    return "Service{" +
      "id=" + this.id +
      ", name='" + this.name + '\'' +
      ", description='" + this.description + '\'' +
      ", image=" + this.image.toString() +
      '}';
  }

  public serialize = (): Service => {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      image: this.image.serialize()
    } as Service
  }

  public deserialize = (data: Service): Service => {

    this.id = data.id,
    this.name = data.name
    this.description = data.description
    this.image = data.image

    return this
  }

}
