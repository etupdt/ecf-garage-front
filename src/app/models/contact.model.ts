import { Garage } from "./garage.model";

export class Contact {

  id: number
  subject: string
  message: string
  garage: Garage

  constructor(data: any) {
    this.id = data.id;
    this.subject = data.subject
    this.message = data.message
    this.garage = data.garage
  }

  toString() {

    return `{ \
      "id": ${this.id}, \
      "subject": "${this.subject},", \
      "message": ${JSON.stringify(this.message, undefined, 2)} \
      "garage": ${this.garage.toString()} \
    }`

  }


  serialize() {
    return {
      id: this.id,
      subject: this.subject,
      message: this.message,
      garage: this.garage.serialize()
    }
  }

  deserialize(data: any) {
    this.id = data.id,
    this.subject = data.subject
    this.message = data.message
    this.garage = data.garage.deserialize()

    return this
  }

}
