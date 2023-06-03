import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
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

  garageForm!: FormGroup
  errorMessage!: string

  garage!: Garage

  serviceList: Service[] = []

  buttons!: {
    label: string
    invalid: Function,
    click: Function
  }[]

  message = ""

  form$!: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private garageService: GarageService,
    private serviceService: ServiceService,
    public dialog: MatDialog
    ) {
  }

  ngOnInit(): void {

    this.reInit()
    this.getGarage()

  }

  initForm = () => {
console.log('garage', this.garage)
    this.garageForm = this.formBuilder.group({
      raison: ["Garage Vincent Parrot", [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      phone: [this.garage.phone, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
      address1: [this.garage.address1, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{6,}/)]],
      address2: [this.garage.address2, [Validators.nullValidator, Validators.pattern(/[0-9a-zA-Z \-]{6,}/)]],
      zip: [this.garage.zip, [Validators.required, Validators.pattern(/[0-9]{5,}/)]],
      locality: [this.garage.locality, [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      services: [this.garage.services],
      day1hours: [this.garage.day1hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day2hours: [this.garage.day2hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day3hours: [this.garage.day3hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day4hours: [this.garage.day4hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day5hours: [this.garage.day5hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day6hours: [this.garage.day6hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day7hours: [this.garage.day7hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
    })

    this.garageForm.valueChanges.subscribe(change => {console.log(this.garageForm.get("services")?.value)})

  }

  reInit = () => {

    this.garage = new Garage ({
      'raison': 'Garage Vincent Parrot',
      'phone': '',
      'address1': '',
      'address2': '',
      'zip': 0,
      'locality': '',
      "day1hours" : "09:00 - 12:00, 14:00 - 18;:00",
      "day2hours" : "09:00 - 12:00, 14:00 - 18;:00",
      "day3hours" : "09:00 - 12:00, 14:00 - 18;:00",
      "day4hours" : "09:00 - 12:00, 14:00 - 18;:00",
      "day5hours" : "09:00 - 12:00, 14:00 - 18;:00",
      "day6hours" : "09:00 - 12:00, 14:00 - 18;:00",
      "day7hours" : "Fermé",
    })

    this.displayMessage(0)
    this.onGarageChange()

  }

  create = () => {

    const garage = this.garage.deserialize({

      'id': this.garage.id,
      'raison': this.garageForm.get("raison")!.value,
      'phone': this.garageForm.get("phone")!.value,
      'address1': this.garageForm.get("address1")!.value,
      'address2': this.garageForm.get("address2")!.value,
      'zip': this.garageForm.get("zip")!.value,
      'locality': this.garageForm.get("locality")!.value,
      "day1hours" : this.garageForm.get("day1hours")!.value,
      "day2hours" : this.garageForm.get("day2hours")!.value,
      "day3hours" : this.garageForm.get("day3hours")!.value,
      "day4hours" : this.garageForm.get("day4hours")!.value,
      "day5hours" : this.garageForm.get("day5hours")!.value,
      "day6hours" : this.garageForm.get("day6hours")!.value,
      "day7hours" : this.garageForm.get("day7hours")!.value,

    })

    this.garageForm.get("services")!.value.forEach((service: Service) => garage.services.push(service))

    if (garage.id === 0) {

      this.garageService.postGarage(garage).subscribe({
        next: (res: any) => {
          this.displayMessage(0)
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

    } else {

      this.garageService.putGarage(garage).subscribe({
        next: (res: any) => {
          this.displayMessage(0)
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
        },
      })

    }

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
        this.reInit()
      }
    })

  }

  getGarage = () => {

    this.garageService.getGarageById(6).subscribe({
      next: (res: any) => {
        this.garage = this.garage.deserialize(res);
        this.garage.services = res.services
        this.getServices()
        this.displayMessage(0)
        this.onGarageChange()
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la récupération du garage`,
            message2: error.error.message,
            delai: 0
          }
        })
        this.reInit()
      },
      complete () {
        console.log('getGaragebyid complete')
      }
    })

  }

  onGarageChange = () => {
    this.initForm()
    this.displayMessage(0)
  }

  displayMessage = (phase: number) => {

    if (phase === 0) {
      if (this.garageForm)
        this.garageForm.disable()
      this.buttons = [
        {
          label: "Modifier",
          invalid: ()  => {return false},
          click: () => {
            this.displayMessage(1)
          }
        }
      ]

      this.message = ""

    }

    if (phase === 1) {
      this.garageForm.enable()
      this.buttons = [
        {
          label: "Enregistrer",
          invalid: () => {return this.garageForm.invalid},
          click: () => {
            this.create()
          }
        },
        {
          label: "Abandonner",
          invalid:  ()  => {return false},
          click: () => {
            this.onGarageChange()
          }
        },
      ]
    }

  }

  compareServices(i1: Service, i2: Service) {
    return i1 && i2 && i1.id===i2.id;
  }

}
