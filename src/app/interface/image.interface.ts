export interface IImage {

  id: number
  filename: string
  //  car: Car

  serialize?: Function
  deserialize?: Function

}
