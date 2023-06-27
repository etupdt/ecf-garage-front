import { Garage } from "./garage.model";

export class Contact {

  id!: number
  subject!: string
  message!: string
  garage!: Garage
  firstname!: string
  lastname!: string
  email!: string
  phone!: string

  constructor() {
  }

  toString() {

    return `{ \
      "id": ${this.id}, \
      "subject": "${this.subject},", \
      "message": ${JSON.stringify(this.message, undefined, 2)} \
      "firstname": "${this.firstname}", \
      "lastname": "${this.lastname}", \
      "email": "${this.email}", \
      "phone": "${this.phone}", \
      "garage": ${this.garage.toString()} \
    }`

  }

  serialize() {
    return {
      id: this.id,
      subject: this.subject,
      message: this.message,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      phone: this.phone,
      garage: this.garage.serialize()
    }
  }

  deserialize(data: any) {
    this.id = data.id,
    this.subject = data.subject
    this.message = data.message
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.email = data.email
    this.phone = data.phone
    this.garage = new Garage().deserialize(data.garage)

    return this
  }

}
