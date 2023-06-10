import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
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

  lastCar!: Car
  carH3Label: string = ''

  carForm!: FormGroup

  garage$!: Garage

  carOptions: Option[] = []
  optionList: Option[] = []

  image!: string
  newImage!: string
  frontImage: FormData = new FormData()
  imageClass = "image-h"

  isUpdated = false

  constructor(
    private formBuilder: FormBuilder,
    private carService: CarService,
    private imageService: ImageService,
    private garageService: GarageService,
    private optionService: OptionService,
    private dialog: MatDialog,
    private featureService: FeatureService
  ) {
  }

  ngOnInit(): void {
    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})
    this.getOptions()
    this.initForm(this.carService.initCar())
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('onChangesCar')
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
        brand: [car.brand, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{2,}/)]],
        model: [car.model, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{1,}/)]],
        price: [car.price, [Validators.required, Validators.pattern(/[0-9]{1,}/)]],
        year: [car.year, [Validators.required, Validators.pattern(/[0-9]{1,}/)]],
        kilometer: [car.kilometer, [Validators.required, Validators.pattern(/[0-9]{1,}/)]],
        description: [car.description, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{1,}/)]],
        imageId: [car.image.id],
        hash: [car.image.hash],
        options: [this.carOptions],
      })

      if (car.image) {
        this.image = ''
        if (car.image.filename !== '') {
          this.image = environment.useBackendImages + '/car_' + car.id + '_' + car.image.filename
          this.imageChange()
        }
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
    this.car?.image.hash !== this.carForm.get("hash")!.value

    return this.isUpdated

  }

  formatCar = (car: Car): Car => {

    return car.deserialize({
      id: this.carForm.get("id")?.value,
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
      features: [],
      images: [],
      garage: this.garage$
    })

  }

  saveCar = () => {

    let car = this.formatCar(new Car())

    this.frontImage.append('car', car.toString())
    this.frontImage.append('id', `${car.id}`)

    if (this.state === 'create') {

      this.carService.postCar(this.frontImage).subscribe({
        next: (res) => {
          car = new Car().deserialize(res)
          this.newcar.emit(car)
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

  onFileSelected = () => {

//    this.frontImage = new FormData()

    const inputNode: any = document.querySelector('#file');

    if (inputNode.files[0]) {

      this.frontImage.append("garage_image", inputNode.files[0]);

      var reader = new FileReader();
      reader.readAsDataURL(inputNode.files[0]);

      reader.onload = () => {
        const hash = Md5.hashStr(reader.result as string)
        this.carForm.get("hash")!.setValue(hash)
        this.carForm.get("brand")!.setValue(this.carForm.get("brand")!.value)
        this.frontImage.append("image_hash", hash);
        this.image = reader.result as string
        this.imageChange()
      };

    }

  }

  imageChange = () => {

    let img: HTMLImageElement = new Image()
    img.src = this.image

    img.onload = () => {
      this.imageClass = img.width > img.height ? "image-h" : "image-v"
    };

  }

  cancel = () => {

    if (!this.isUpdated) {
      this.stateChange.emit('display')
      this.samecar.emit(this.car)
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
      this.samecar.emit(this.car)

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
    this.car.features.push(this.featureService.initFeature());
  }

  deleteFeature = (index: number) => {

  }

}
