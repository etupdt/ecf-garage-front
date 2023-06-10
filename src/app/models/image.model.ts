import { IImage } from "../interface/image.interface";

export class Image {

  id!: number
  filename!: string
  hash!: string

  constructor() {
  }

  toString() {
    
    return `{ \
      "id": ${this.id}, \
      "filename": "${this.filename}", \ \
      "hash": "${this.hash}" \
    }`

  }

  serialize = (): Image => {
    return {
      id: this.id,
      filename: this.filename,
      hash: this.hash,
    } as Image
  }

  deserialize(data: Image) {

    this.id = data.id,
    this.filename = data.filename
    this.hash = data.hash

    return this

  }

}
