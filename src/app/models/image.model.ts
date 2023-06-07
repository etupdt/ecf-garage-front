import { IImage } from "../interface/image.interface";

export class Image {

  id!: number
  filename!: string

  constructor() {
  }

  toString() {
    return "Image{" +
      "id=" + this.id +
      ", filename='" + this.filename + '\'' +
      '}';
  }

  serialize = (): Image => {
    return {
      id: this.id,
      filename: this.filename,
    } as Image
  }

  deserialize(data: Image) {

    this.id = data.id,
    this.filename = data.filename

    return this

  }

}
