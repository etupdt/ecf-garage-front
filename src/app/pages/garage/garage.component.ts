import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Garage } from 'src/app/models/garage.model';
import { GarageService } from 'src/app/services/garage.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-garage',
  templateUrl: './garage.component.html',
  styleUrls: ['./garage.component.scss']
})
export class GarageComponent implements OnInit {

  garageForm!: FormGroup
  errorMessage!: string

  garage!: Garage

  serviceList: string[] = ['Carrosserie', 'Mécaniqe', 'Révision']

  constructor(
    private formBuilder: FormBuilder,
    private garageService: GarageService,
  ) {
  }
  ngOnInit(): void {

//    this.garageService.listenGarage.subscribe((garage) => {this.garage = garage as Garage})

    this.reInit()
    this.getGarage()

  }

  initForm = () => {

    this.garageForm = this.formBuilder.group({
      raison: ["Garage Vincent Parrot", [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      phone: [this.garage.phone, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
      address1: [this.garage.address1, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{6,}/)]],
      address2: [this.garage.address2, [Validators.nullValidator, Validators.pattern(/[0-9a-zA-Z \-]{6,}/)]],
      zip: [this.garage.zip, [Validators.required, Validators.pattern(/[0-9]{5,}/)]],
      locality: [this.garage.locality, [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      day1hours: [this.garage.day1hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day2hours: [this.garage.day2hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day3hours: [this.garage.day3hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day4hours: [this.garage.day4hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day5hours: [this.garage.day5hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day6hours: [this.garage.day6hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
      day7hours: [this.garage.day7hours, [Validators.required, Validators.pattern(/[0-9a-zA-Z \-]{0,}/)]],
    })

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

    this.initForm()

  }

  onSubmit = () => {

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

    if (garage.id === 0) {

      this.garageService.postGarage(garage).subscribe({
        next: (res: any) => {
          console.log(res)
        },
        error: (error: { error: { message: any; }; }) => {
          this.errorMessage = error.error.message
        },
        complete () {
          console.log('Sauvegarde post garage complete')
        }
      })

    } else {

      this.garageService.putGarage(garage).subscribe({
        next: (res: any) => {
          console.log(res)
        },
        error: (error: { error: { message: any; }; }) => {
          this.errorMessage = error.error.message
        },
        complete () {
          console.log('Sauvegarde put garage complete')
        }
      })

    }

  }

  getGarage = () => {

    this.garageService.getGarageById(6).subscribe({
      next: (res: any) => {
        this.garage = this.garage.deserialize(res);
        this.initForm()
      },
      error: (error: { error: { message: any; }; }) => {
        this.errorMessage = error.error.message
        this.reInit()
      },
      complete () {
        console.log('getGaragebyid complete')
      }
    })

  }

}
