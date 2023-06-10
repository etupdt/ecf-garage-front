import { Image } from "../models/image.model";

export class Service {

  id!: number;
  name!: string;
  description!: string;
  image!: Image;

  constructor()
  {}

  toString() {

    return `{ \
      "id": ${this.id}, \
      "name": "${this.name}", \
      "description": "${this.description}," \
      "image": ${this.image.toString()} \
    }`

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
    this.image = new Image().deserialize(data.image)

    return this
  }

}
