import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Photo } from 'src/app/interface/photo.interface';
import { Car } from 'src/app/models/car.model';
import { Feature } from 'src/app/models/feature.model';
import { Garage } from 'src/app/models/garage.model';
import { Image as MImage } from 'src/app/models/image.model';
import { Option } from 'src/app/models/option.model';
import { CarService } from 'src/app/services/car.service';
import { FeatureService } from 'src/app/services/feature.service';
import { GarageService } from 'src/app/services/garage.service';
import { ImageService } from 'src/app/services/image.service';
import { OptionService } from 'src/app/services/option.service';
import { environment } from 'src/environments/environment';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: [
    './car.component.scss',
    '../../app.component.scss'
  ]
})
export class CarComponent implements OnInit {

  @Input() car: Car = this.carService.initCar()
  @Output() samecar: EventEmitter<Car> = new EventEmitter();
  @Output() newcar: EventEmitter<Car> = new EventEmitter<Car>();
  @Input() state: string = "display"
  @Output() stateChange: EventEmitter<string> = new EventEmitter();

  lastCar: Car = this.carService.initCar()

  carH3Label: string = ''

  carForm!: FormGroup

  garage$!: Garage

  useBackendImages = ''

  carOptions: Option[] = []
  optionList: Option[] = []

  image: MImage = this.imageService.initImage()
  newImage!: string
  frontImage: FormData = new FormData()
  imageClass = "image-h"
  imageGalleryIndex: number = 1

  images: Photo[] = []

  isUpdated = false

  annee: number = 2022

  sizeTable = 4

  constructor(
    private formBuilder: FormBuilder,
    private carService: CarService,
    private imageService: ImageService,
    private garageService: GarageService,
    private optionService: OptionService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.sizeTable = window.innerWidth <= 800 ? 2 : 4;
    this.annee = (new Date()).getFullYear()
    this.useBackendImages = environment.useBackendImages + '/'
    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})
    this.getOptions()
    this.initForm(this.carService.initCar())
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.state === 'create') {
      this.initForm(this.carService.initCar()
    )} else {
      this.initForm(this.car)
    }
  }

  ngOnDestroy(): void {
    this.quit()
  }

  quit = () => {

    if (this.isUpdated && !this.carForm.invalid) {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          type: 'Confirmation',
          message1: `Voulez vous sauvegarder l'utilisateur ?`,
          message2: "",
          buttons: ['Enregistrer', 'Ne pas enregistrer']
        }
      })

      dialogRef.afterClosed().subscribe(result => {

        switch (result) {
          case 'Enregistrer' : {
            this.saveCar()
            break
          }
        }
      });

    }
  }

  initForm = (car: Car) => {

    if (car) {

      this.carOptions = new Car().deserialize(car).options

      this.carForm = this.formBuilder.group({
        id: [{value: car.id, disabled: true}],
        brand: [
          car.brand,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/)
          ]
        ],
        model: [
          car.model,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/)
          ]
        ],
        price: [
          car.price === 0 ? '' : car.price,
          [
            Validators.required,
            Validators.pattern(/[0-9]{0,}/),
            Validators.min(1)
          ]
        ],
        year: [
          car.year === 0 ? '' : car.year,
          [
            Validators.required,
            Validators.pattern(/[0-9]{0,}/),
            Validators.min(1950),
            Validators.max(this.annee)
          ]
        ],
        kilometer: [
          car.kilometer === 0 ? '' : car.kilometer,
          [
            Validators.required,
            Validators.pattern(/[0-9]{0,}/),
            Validators.min(1)
          ]
        ],
        description: [
          car.description,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/)
          ]
        ],
        imageId: [
          car.image.id
        ],
        hash: [
          car.image.hash
        ],
        options: [
          this.carOptions
        ],
        features: this.formBuilder.array([])
      })

      if (car.image) {
        this.image.filename = ''
        if (car.image.filename !== '') {
          this.image.filename = car.image.filename
          this.imageChange()
        }
      }

      this.images = []
      if (car.images) {
        this.imageGalleryIndex = 1
        car.images.forEach(image => {
          this.images.push({
            index: 0,
            image: new MImage().deserialize({
              id: image.id,
              filename: image.filename,
              hash: image.hash
            } as MImage)
          })
          this.imageGalleryIndex++
        })
      }

      if (car.features) {
        car.features.forEach(feature => {
          this.features.push(this.formBuilder.group({
            id: [feature.id],
            name: [
              feature.name,
              [
                Validators.required,
                Validators.minLength(2),
                Validators.pattern(/^.*$/)
              ]
            ],
            description: [
              feature.description,
              [
                Validators.required,
                Validators.minLength(2),
                Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
              ]
            ]
          }))
        })
      }

      this.carH3Label = this.car ? `Voiture ${this.car.model} ${this.car.brand}` : ''

      switch (this.state) {
        case 'display' : {
          this.carForm.disable()
          break
        }
        case 'update' : {
          this.frontImage = new FormData()
          this.carForm.enable()
          break
        }
        case 'create' : {
          this.frontImage = new FormData()
          this.carForm.enable()
          this.carH3Label = 'Nouvelle voiture'
          break
        }
      }

      this.carForm.valueChanges.subscribe(change => {
        this.isUpdated = this.checkChanges()
      })

      this.isUpdated = false

    }

  }

  checkChanges(): boolean {

    this.isUpdated = this.car?.brand !== this.carForm.get("brand")!.value ||
    this.car?.model !== this.carForm.get("model")!.value ||
    this.car?.description !== this.carForm.get("description")!.value ||
    this.car?.price !== this.carForm.get("price")!.value ||
    this.car?.year !== this.carForm.get("year")!.value ||
    this.car?.kilometer !== this.carForm.get("kilometer")!.value ||
    this.car?.image.hash !== this.carForm.get("hash")!.value ||
    this.features.controls.length !== this.car.features.length

    for (let i = 0; i < this.features.controls.length; i++) {
      const f1 = this.features.at(i)
      const f2 = this.car.features.find((f2: Feature) => f2.id === f1.get('id')?.value)
      this.isUpdated = this.isUpdated ||
        f2 === null ||
        f2!.name !== f1.get('name')?.value ||
        f2!.description !== f1.get('description')?.value
    }

    return this.isUpdated

  }

  formatCar = (car: Car): Car => {

    let images: {
      index: number,
      image: MImage
    }[] = []

    this.images.forEach(image => {
      car.images.push(new MImage().deserialize({
        id: image.image.id,
        filename: image.index !== 0 ? `${image.index}` : image.image.filename,
        hash: image.image.hash
      } as MImage))
    })

    for (let i = 0; i < this.features.controls.length; i++) {
      car.features.push(new Feature().deserialize({
        id: this.features.at(i).get('id')?.value,
        name: this.features.at(i).get('name')?.value,
        description: this.features.at(i).get('description')?.value
      } as Feature))
    }

    return car.deserialize({
      id: this.car ? this.car.id : 0,
      brand: this.carForm.get("brand")?.value,
      model: this.carForm.get("model")?.value,
      description: this.carForm.get("description")?.value,
      price: +this.carForm.get("price")?.value,
      year: +this.carForm.get("year")?.value,
      kilometer: +this.carForm.get("kilometer")?.value,
      image: new MImage().deserialize({
        id: this.carForm.get("imageId")?.value,
        filename: '',
        hash: this.carForm.get("hash")?.value
      } as MImage),
      options: this.carForm.get('options')?.value,
      features: car.features,
      images: car.images,
      garage: this.garage$
    })

  }

  saveCar = () => {

    let car = this.formatCar(this.carService.initCar())

    this.frontImage.append('car', car.toString())
    this.frontImage.append('id', `${car.id}`)

    if (this.state === 'create') {

      this.carService.postCar(this.frontImage).subscribe({
        next: (res) => {
          this.newcar.emit(new Car().deserialize(res))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La création du nouveau car est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la création du car`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    } else if (this.state === 'update') {

      this.carService.putCar(this.frontImage).subscribe({
        next: (res) => {
          car = new Car().deserialize(res)
          this.samecar.emit(car)
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La modification de la voiture est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la modification de la voiture`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    }
  }

  onFileSelected = (origine: string) => {

//    this.frontImage = new FormData()

    const inputNode: any = document.querySelector('#' + origine);

    if (inputNode.files[0]) {

      var reader = new FileReader();
      reader.readAsDataURL(inputNode.files[0]);

      reader.onload = () => {

        const hash = Md5.hashStr(reader.result as string)

        this.carForm.get("brand")!.setValue(this.carForm.get("brand")!.value)

        if (origine === 'principale') {
          this.frontImage.append("car_image", inputNode.files[0]);
          this.carForm.get("hash")?.setValue(hash)
          this.image = new MImage().deserialize({
            id: 0,
            filename: reader.result as string,
            hash: hash
          } as MImage)
        } else {
          this.frontImage.append(`${this.imageGalleryIndex}_image`, inputNode.files[0]);
          this.images.push({
            index: this.imageGalleryIndex,
            image: new MImage().deserialize({
              id: 0,
              filename: reader.result as string,
              hash: hash
            } as MImage
          )})
          this.imageGalleryIndex++
        }

        this.imageChange()
      };

    }

  }

  imageChange = () => {

    let img: HTMLImageElement = new Image()
    img.src = this.image.filename.indexOf('data:image') === 0 ? this.image.filename : environment.useBackendImages + '/' + this.image.filename

    img.onload = () => {
      this.imageClass = img.width > img.height ? "image-h" : "image-v"
    }

  }

  cancel = () => {

    if (!this.isUpdated) {
      this.stateChange.emit('display')
      this.samecar.emit(this.car.id === 0 ? undefined : this.car)
      return
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: 'Confirmation',
        message1: `Désirez vous réellement abandonner cette saisie ?`,
        message2: "",
        buttons: ['Oui', 'Non']
      }
    })

    dialogRef.afterClosed().subscribe(result => {

      if (result !== 'Oui')
        return

      this.stateChange.emit('display')
      this.samecar.emit(this.car.id === 0 ? undefined : this.car)

    })

  }

  compareOptions(i1: Option, i2: Option) {
    return i1 && i2 && i1.id===i2.id;
  }

  getOptions = () => {

    this.optionService.getOptions().subscribe({
      next: (res: any) => {
        res.forEach((option: Option) => {
          const serviceDeserialized = new Option().deserialize(option as Option)
          this.optionList.push(serviceDeserialized)
        })
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la récupération de la liste des services disponibles`,
            message2: error.error.message,
            delai: 0
          }
        })
      }
    })

  }

  addFeature = () => {
    this.features.push(this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      description: ['', Validators.required]
    }))
  }

  deleteFeature = (index: number) => {
    this.features.removeAt(index)
  }

  get features() {
    return this.carForm.controls['features'] as FormArray
  }

  onSamephotos = (photos: Photo[]) => {
    this.images = photos
  }

  onResizeTable = (event: UIEvent) => {
    this.sizeTable = ((event.target! as Window).innerWidth <= 800) ? 2 : 4;
  }

  get brand() { return this.carForm.get('brand')! as FormControl }
  get model() { return this.carForm.get('model')! as FormControl }
  get price() { return this.carForm.get('price')! as FormControl }
  get year() { return this.carForm.get('year')! as FormControl }
  get kilometer() { return this.carForm.get('kilometer')! as FormControl }
  get description() { return this.carForm.get('description')! as FormControl }

}
