export class Garage {

  id: number
  raison: string
  phone: string
  address1: string
  address2: string
  zip: string
  locality: string
  day1hours: string
  day2hours: string
  day3hours: string
  day4hours: string
  day5hours: string
  day6hours: string
  day7hours: string
//  contacts: Contact[]
//  comments: Comment[]
//  cars: Car[]
//  services: Service[]
//  users: User[]

  constructor(data: any) {
    this.id = data.id;
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
  }

  toString() {
    return "Garage{" +
      "id=" + this.id +
      ", raison=" + this.raison + '\'' +
      ", phone=" + this.phone + '\'' +
      ", address1=" + this.address1 + '\'' +
      ", address2=" + this.address2 + '\'' +
      ", zip=" + this.zip + '\'' +
      ", locality=" + this.locality + '\'' +
      ", day1hours=" + this.day1hours + '\'' +
      ", day2hours=" + this.day2hours + '\'' +
      ", day3hours=" + this.day3hours + '\'' +
      ", day4hours=" + this.day4hours + '\'' +
      ", day5hours=" + this.day5hours + '\'' +
      ", day6hours=" + this.day6hours + '\'' +
      ", day7hours=" + this.day7hours + '\'' +
      '}';
  }

  serialize() {
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
      day7hours: this.day7hours
    }
  }

  deserialize(data: any) {
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

  }

}
