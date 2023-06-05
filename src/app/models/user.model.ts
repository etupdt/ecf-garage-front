import { Garage } from "./garage.model";

export class User {

  id!: number;
  email!: string;
  roles!: string[];
  password!: string;
  firstname!: string;
  lastname!: string;
  phone!: string;
  garage!: Garage;

  constructor() {
  }

  toString() {
    return "User{" +
      "id=" + this.id +
      ", email='" + this.email + '\'' +
      ", roles='" + this.roles + '\'' +
      ", password=****" +
      ", firstname='" + this.firstname + '\'' +
      ", lastname='" + this.lastname + '\'' +
      ", phone='" + this.phone + '\'' +
      ", garage='" + this.garage.toString() + '\'' +
      '}';
  }

  serialize() {
    return {
      id: this.id,
      email: this.email,
      roles: this.roles,
      password: this.password,
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      garage: this.garage.serialize()
    }
  }

  deserialize(data: any) {
    this.id = data.id,
    this.email = data.email,
    this.roles = data.roles,
    this.password = data.password,
    this.firstname = data.firstname,
    this.lastname = data.lastname,
    this.phone = data.phone

    return this
  }

}
