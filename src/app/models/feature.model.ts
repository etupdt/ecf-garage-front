export class Feature {

  id: number
  name: string
  description: string

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name
    this.description = data.description
  }

  toString() {
    return "Feature{" +
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
