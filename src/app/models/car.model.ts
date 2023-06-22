import { Feature } from "./feature.model"
import { Option } from "./option.model"
import { Image } from "./image.model"
import { Garage } from "./garage.model"

export class Car {

  id!: number
  brand!: string
  model!: string
  price!: number
  year!: number
  kilometer!: number
  description!: string
  options!: Option[]
  features!: Feature[]
  garage!: Garage
  image!: Image
  images!: Image[]

  constructor() {
  }

  toString() {

    let options: string[] = []
    this.options.forEach(option => {
      options.push(option.toString())
    })
    let optionsString = '[' + options.join() + ']'

    let features: string[] = []
    this.features.forEach(feature => {
      features.push(feature.toString())
    })
    let featuresString = '[' + features.join() + ']'

    let images: string[] = []
    this.images.forEach(image => {
      images.push(image.toString())
    })
    let imagesString = '[' + images.join() + ']'

    console.log('saut', this.description.replace(/\n/gm, '\\n'))

    return `{ \
      "id": ${this.id}, \
      "price": ${this.price}, \ \
      "year": ${this.year}, \
      "kilometer": ${this.kilometer}, \
      "options": ${optionsString}, \
      "garage": ${this.garage.toString()}, \
      "features": ${featuresString}, \
      "image": ${this.image.toString()}, \
      "images": ${imagesString}, \
      "brand": "${this.brand}", \
      "model": "${this.model}", \
      "description": ${JSON.stringify(this.description, undefined, 2)} \
    }`

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
      description: this.description,
      options: optionsSerialized,
      features: featuresSerialized,
      garage: this.garage.serialize(),
      image: this.image.serialize(),
      images: imagesSerialized
    }

  }

  deserialize(data: any) {

    let optionsDeSerialized: any[] = []
    if (data.options != null) {
      data.options.forEach((option: Option) => {
        optionsDeSerialized.push(new Option().deserialize(option))
      })
    }

    let featuresDeSerialized: any[] = []
    if (data.features != null) {
      data.features.forEach((feature: Feature) => {
        featuresDeSerialized.push(new Feature().deserialize(feature))
      })
    }

    let imagesDeSerialized: any[] = []
    if (data.images != null) {
      data.images.forEach((image: Image) => {
        imagesDeSerialized.push(new Image().deserialize(image))
      })
    }

    this.id = data.id,
    this.brand = data.brand,
    this.model = data.model,
    this.price = data.price,
    this.year = data.year,
    this.kilometer = data.kilometer,
    this.description = data.description
    this.options = optionsDeSerialized,
    this.features = featuresDeSerialized,
    this.garage = data.garage ? new Garage().deserialize(data.garage) : {} as Garage,
    this.image = new Image().deserialize(data.image),
    this.images = imagesDeSerialized

    return this

  }

}
