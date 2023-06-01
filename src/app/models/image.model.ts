import { IImage } from "../interface/image.interface";

export class Image implements IImage {

  id: number
  filename: string

  constructor(data: any) {
    this.id = data.id;
    this.filename = data.filename
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

  public deserialize(data: Image) {

    this.id = data.id,
    this.filename = data.filename

  }

}
