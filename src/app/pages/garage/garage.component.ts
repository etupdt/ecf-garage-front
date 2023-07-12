import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Garage } from 'src/app/models/garage.model';
import { Service } from 'src/app/models/service.model';
import { GarageService } from 'src/app/services/garage.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.scss']
})
export class GarageComponent implements OnInit {

  @Input() garage!: Garage
  @Output() samegarage: EventEmitter<Garage> = new EventEmitter();
  @Output() newgarage: EventEmitter<Garage> = new EventEmitter<Garage>();
  @Input() state: string = "display"
  @Output() stateChange: EventEmitter<string> = new EventEmitter();

  lastGarage!: Garage
  garageH3Label: string = ''
  garageServices: Service[] = []
  garageForm!: FormGroup

  isUpdated = false

  sizeTable = 4

  constructor(
    private formBuilder: FormBuilder,
    private garageService: GarageService,
    private serviceService: ServiceService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    this.sizeTable = window.innerWidth <= 800 ? 2 : 4;

    this.getServices()
    this.initForm(this.garage)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.state === 'create') {
      this.initForm(new Garage().deserialize(this.garageService.garageInit)
    )} else {
      this.initForm(this.garage)
    }
  }

  ngOnDestroy(): void {
    this.quit()
  }

  quit = () => {

    if (this.isUpdated && !this.garageForm.invalid) {

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
            this.saveGarage()
            break
          }
        }
      });

    }
  }

  initForm = (garage: Garage) => {

    if (garage) {

      this.garageServices = new Garage().deserialize(garage).services

      this.garageForm = this.formBuilder.group({
        raison: [
          garage.raison,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        phone: [
          garage.phone,
          [
            Validators.required,
            Validators.pattern(/^(0)[1-9]( \d{2}){4}$/),
          ]
        ],
        address1: [
          garage.address1,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        address2: [
          garage.address2,
          [
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        zip: [
          garage.zip,
          [
            Validators.required,
            Validators.pattern(/[0-9]{0,}/),
            Validators.minLength(5),
            Validators.maxLength(5),
          ]
        ],
        locality: [
          garage.locality,
          [
            Validators.required,
            Validators.minLength(1),
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        services: [this.garageServices],
        day1hours: [
          garage.day1hours,
          [
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        day2hours: [
          garage.day2hours,
          [
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        day3hours: [
          garage.day3hours,
          [
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        day4hours: [
          garage.day4hours,
          [
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        day5hours: [
          garage.day5hours,
          [
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        day6hours: [
          garage.day6hours,
          [
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        day7hours: [
          garage.day7hours,
          [
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
      })

      this.garageH3Label = garage ? `${garage.raison}` : ''

      switch (this.state) {
        case 'display' : {
          this.garageForm.disable()
          break
        }
        case 'update' : {
          this.garageForm.enable()
          break
        }
        case 'create' : {
          this.garageForm.enable()
          this.garageH3Label = 'Nouvel utilisateur'
          break
        }
      }

      this.garageForm.valueChanges.subscribe(change => {
        this.isUpdated = this.checkChanges()
      })

      this.isUpdated = false

    }

  }

  checkChanges(): boolean {

    let servicesIdentical = true
    this.garage.services
      .forEach(s1 => {
        if (this.garageForm.get('services')?.value.findIndex((s2: Service) => s2.id === s1.id) === -1) {
          servicesIdentical = false
        }
      })

    this.isUpdated = this.garage.raison !== this.garageForm.get("raison")!.value ||
    this.garage.phone !== this.garageForm.get("phone")!.value ||
    this.garage.address1 !== this.garageForm.get("address1")!.value ||
    this.garage.address2 !== this.garageForm.get("address2")!.value ||
    this.garage.zip !== this.garageForm.get("zip")!.value ||
    this.garage.locality !== this.garageForm.get("locality")!.value ||
    this.garage.day1hours !== this.garageForm.get("day1hours")!.value ||
    this.garage.day2hours !== this.garageForm.get("day2hours")!.value ||
    this.garage.day3hours !== this.garageForm.get("day3hours")!.value ||
    this.garage.day4hours !== this.garageForm.get("day4hours")!.value ||
    this.garage.day5hours !== this.garageForm.get("day5hours")!.value ||
    this.garage.day6hours !== this.garageForm.get("day6hours")!.value ||
    this.garage.day7hours !== this.garageForm.get("day7hours")!.value ||
    !servicesIdentical ||
    this.garage.services.length !== this.garageForm.get('services')?.value.length

    return this.isUpdated

  }

  formatGarage = (garage: Garage): Garage => {

    return garage.deserialize({
      id: this.garage ? this.garage.id : 0,
      raison: this.garageForm.get("raison")?.value,
      address1: this.garageForm.get("address1")?.value,
      address2: this.garageForm.get("address2")?.value,
      zip: this.garageForm.get("zip")?.value,
      locality: this.garageForm.get("locality")?.value,
      phone: this.garageForm.get("phone")?.value,
      day1hours: this.garageForm.get("day1hours")!.value,
      day2hours: this.garageForm.get("day2hours")!.value,
      day3hours: this.garageForm.get("day3hours")!.value,
      day4hours: this.garageForm.get("day4hours")!.value,
      day5hours: this.garageForm.get("day5hours")!.value,
      day6hours: this.garageForm.get("day6hours")!.value,
      day7hours: this.garageForm.get("day7hours")!.value,
      services: this.garageForm.get('services')?.value
    })

  }

  saveGarage = () => {

    let garage = this.formatGarage(new Garage())

    if (this.state === 'create') {

      this.garageService.postGarage(garage).subscribe({
        next: (res) => {
          this.newgarage.emit(new Garage().deserialize(res[0]))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La création du nouveau garage est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la création du garage`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    } else if (this.state === 'update') {

      this.garageService.putGarage(garage).subscribe({
        next: (res) => {
          console.log(res)
          this.samegarage.emit(new Garage().deserialize(res))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La modification du garage est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la modification du garage`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    }
  }

  cancel = () => {

    if (!this.isUpdated) {
      this.stateChange.emit('display')
      this.samegarage.emit(this.garage)
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
      this.samegarage.emit(this.garage)

    })

  }


  //=======================> Spécifique garage : liste de service disponible
  serviceList: Service[] = []

  compareServices(i1: Service, i2: Service) {
    return i1 && i2 && i1.id===i2.id;
  }

  getServices = () => {

    this.serviceService.getServices().subscribe({
      next: (res: any) => {
        res.forEach((service: Service) => {
          const serviceDeserialized = new Service().deserialize(service as Service)
          this.serviceList.push(serviceDeserialized)
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

  onResizeTable = (event: UIEvent) => {
    this.sizeTable = ((event.target! as Window).innerWidth <= 800) ? 2 : 4;
  }

  get raison() { return this.garageForm.get('raison')! as FormControl }
  get phone() { return this.garageForm.get('phone')! as FormControl }
  get address1() { return this.garageForm.get('address1')! as FormControl }
  get address2() { return this.garageForm.get('address2')! as FormControl }
  get zip() { return this.garageForm.get('zip')! as FormControl }
  get locality() { return this.garageForm.get('locality')! as FormControl }
  get day1hours() { return this.garageForm.get('day1hours')! as FormControl }
  get day2hours() { return this.garageForm.get('day2hours')! as FormControl }
  get day3hours() { return this.garageForm.get('day3hours')! as FormControl }
  get day4hours() { return this.garageForm.get('day4hours')! as FormControl }
  get day5hours() { return this.garageForm.get('day5hours')! as FormControl }
  get day6hours() { return this.garageForm.get('day6hours')! as FormControl }
  get day7hours() { return this.garageForm.get('day7hours')! as FormControl }

}
