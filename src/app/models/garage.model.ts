import { Car } from "./car.model"
import { Service } from "./service.model"
import { Comment } from "./comment.model"

export class Garage {

  id!: number
  raison!: string
  phone!: string
  address1!: string
  address2!: string
  zip!: number
  locality!: string
  day1hours!: string
  day2hours!: string
  day3hours!: string
  day4hours!: string
  day5hours!: string
  day6hours!: string
  day7hours!: string
//  contacts: Contact[]
  comments!: Comment[]
  cars!: Car[]
  services!: Service[]
//  users: User[]

   constructor() {
  }

  toString() {

    let comments: string = "["
    this.comments.forEach(comment => {
      comments += ", " + comment.toString()
    })
    comments += "]"

    let cars: string = "["
    this.cars.forEach(car => {
      cars += ", " + car.toString()
    })
    cars += "]"

    let services: string = "["
    this.services.forEach(service => {
      services += ", " + service.toString()
    })
    services += "]"

    let retour = "Garage{" +
      "id=" + this.id +
      ", raison='" + this.raison + '\'' +
      ", phone='" + this.phone + '\'' +
      ", address1='" + this.address1 + '\'' +
      ", address2='" + this.address2 + '\'' +
      ", zip=" + this.zip +
      ", locality='" + this.locality + '\'' +
      ", day1hours='" + this.day1hours + '\'' +
      ", day2hours='" + this.day2hours + '\'' +
      ", day3hours='" + this.day3hours + '\'' +
      ", day4hours='" + this.day4hours + '\'' +
      ", day5hours='" + this.day5hours + '\'' +
      ", day6hours='" + this.day6hours + '\'' +
      ", day7hours='" + this.day7hours + '\'' +
      ", comments=" + comments +
      ", cars=" + cars +
      ", services=" + services +
    '}';
  }

  public serialize() {

    let commentsSerialized: any[] = []
    this.comments.forEach(comment => {
      commentsSerialized.push(comment.serialize())
    })

    let carsSerialized: any[] = []
    this.cars.forEach(car => {
      carsSerialized.push(car.serialize())
    })

    let servicesSerialized: any[] = []
    this.services.forEach(service => {
      servicesSerialized.push(service.serialize())
    })

    return {
      id: this.id,
      raison: this.raison,
      phone: this.phone,
      address1: this.address1,
      address2: this.address2,
      zip: this.zip,
      locality: this.locality,
      day1hours: this.day1hours,
      day2hours: this.day2hours,
      day3hours: this.day3hours,
      day4hours: this.day4hours,
      day5hours: this.day5hours,
      day6hours: this.day6hours,
      day7hours: this.day7hours,
      comments: commentsSerialized,
      cars: carsSerialized,
      services: servicesSerialized
    }

  }

  public deserialize(data: any) {

    let commentsDeSerialized: any[] = []
    if (data.comments != null) {
      data.comments.forEach((comment: Comment) => {
        commentsDeSerialized.push(comment.deserialize(comment))
      })
    }

    let carsDeSerialized: any[] = []
    if (data.cars != null) {
      data.cars.forEach((car: Car) => {
        carsDeSerialized.push(car.deserialize(car))
      })
    }

    let servicesDeSerialized: any[] = []
    if (data.services != null) {
      data.services.forEach((service: Service) => {
        servicesDeSerialized.push(new Service().deserialize(service))
      })
    }

    this.id = data.id,
    this.raison = data.raison
    this.phone = data.phone
    this.address1 = data.address1
    this.address2 = data.address2
    this.zip = data.zip
    this.locality = data.locality
    this.day1hours = data.day1hours
    this.day2hours = data.day2hours
    this.day3hours = data.day3hours
    this.day4hours = data.day4hours
    this.day5hours = data.day5hours
    this.day6hours = data.day6hours
    this.day7hours = data.day7hours
    this.comments = commentsDeSerialized
    this.cars = carsDeSerialized
    this.services = servicesDeSerialized

    return this
  }

}
