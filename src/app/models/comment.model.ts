import { Garage } from "./garage.model"

export class Comment {

  id: number
  firstname: string
  lastname: string
  comment: string
  note: number
  isApproved: boolean
  garage: Garage

  constructor(data: any) {
    this.id = data.id
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.comment = data.comment
    this.note = data.note
    this.isApproved = data.isApproved
    this.garage = data.garage
  }

  toString() {
    return "Contact{" +
      "id=" + this.id +
      ", firstname='" + this.firstname + '\'' +
      ", lastname='" + this.lastname + '\'' +
      ", comment='" + this.comment + '\'' +
      ", note=" + this.note +
      ", isApproved=" + this.isApproved +
      ", garage=" + this.garage.toString() +
    '}'
  }

  serialize() {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      comment: this.comment,
      note: this.note,
      isApproved: this.isApproved,
      garage: this.garage.serialize()
    }
  }

  deserialize(data: any) {
    this.id = data.id
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.comment = data.comment
    this.note = data.note
    this.isApproved = data.isApproved
    this.garage = data.garage.deserialize()
  }

}
