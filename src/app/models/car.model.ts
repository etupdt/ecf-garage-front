import { Feature } from "./feature.model"
import { Option } from "./option.model"
import { Image } from "./image.model"
import { Garage } from "./garage.model"

export class Car {

  id: number
  brand: string
  model: string
  price: number
  year: number
  kilometer: number
  options: Option[]
  features: Feature[]
  garage: Garage
  image: Image
  images: Image[]

  constructor(data: any) {
    this.id = data.id
    this.brand = data.brand
    this.model = data.model
    this.price = data.price
    this.year = data.year
    this.kilometer = data.kilometer
    this.options = data.options
    this.features = data.features
    this.garage = data.garage
    this.image = data.image
    this.images = data.images
  }

  toString() {

    let options: string = "["
    this.options.forEach(option => {
      options += ", " + option.toString()
    })
    options += "]"

    let features: string = "["
    this.features.forEach(feature => {
      features += ", " + feature.toString()
    })
    features += "]"

    let images: string = "["
    this.images.forEach(image => {
      images += ", " + image.toString()
    })
    images += "]"

    return "Car{" +
      "id=" + this.id +
      ", brand='" + this.brand + '\'' +
      ", model='" + this.model + '\'' +
      ", price='" + this.price + '\'' +
      ", year='" + this.year + '\'' +
      ", kilometer='" + this.kilometer + '\'' +
      ", options=" + options +
      ", features=" + features +
      ", garage=" + this.garage.toString() +
      ", image=" + this.image.toString() +
      ", images=" + images +
    '}';
  }

  serialize() {

    let optionsSerialized: any[] = []
    this.options.forEach(option => {
      optionsSerialized.push(option.serialize())
    })

    let featuresSerialized: any[] = []
    this.features.forEach(feature => {
      featuresSerialized.push(feature.serialize())
    })

    let imagesSerialized: any[] = []
    this.images.forEach(image => {
      imagesSerialized.push(image.serialize())
    })

    return {
      id: this.id,
      brand: this.brand,
      model: this.model,
      price: this.price,
      year: this.year,
      kilometer: this.kilometer,
      options: optionsSerialized,
      features: featuresSerialized,
      garage: this.garage.serialize(),
      image: this.image.serialize(),
      images: imagesSerialized
    }

  }

  deserialize(data: any) {

    let optionsDeSerialized: any[] = []
    data.options.forEach((option: Option) => {
      optionsDeSerialized.push(option.deserialize(option))
    })

    let featuresDeSerialized: any[] = []
    data.features.forEach((feature: Feature) => {
      featuresDeSerialized.push(feature.deserialize(feature))
    })

    let imagesDeSerialized: any[] = []
    data.images.forEach((image: Image) => {
      imagesDeSerialized.push(data.image.deserialize(image))
    })

    this.id = data.id,
    this.brand = data.brand,
    this.model = data.model,
    this.price = data.price,
    this.year = data.year,
    this.kilometer = data.kilometer,
    this.options = optionsDeSerialized,
    this.features = featuresDeSerialized,
    this.garage = data.garage.deserialize(),
    this.image = data.image.deserialize(),
    this.images = imagesDeSerialized

    return this

  }

}
