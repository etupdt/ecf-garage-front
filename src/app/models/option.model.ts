export class Option {

  id!: number
  name!: string
  description!: string

  constructor() {
  }

  toString() {
    return "Option{" +
      "id=" + this.id +
      ", name='" + this.name + '\'' +
      ", description='" + this.description + '\'' +
      '}';
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
    }
  }

  deserialize(data: any) {
    this.id = data.id,
    this.name = data.name
    this.description = data.description

    return this
  }

}
