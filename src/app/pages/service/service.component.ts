import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IService } from 'src/app/interface/service.interface';
import { Image } from "src/app/models/image.model";
import { Service } from 'src/app/models/service.model';
import { ImageService } from 'src/app/services/image.service';
import { ServiceService } from 'src/app/services/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  serviceForm!: FormGroup
  errorMessage!: string

  services: Service[] = []
  index: number = 0

  image!: string
  frontImage!: FormData

  constructor(
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private serviceService: ServiceService,
  ) {
  }
  ngOnInit(): void {

    this.getServices()

  }

  initForm = (service: Service) => {

    this.serviceForm = this.formBuilder.group({
      name: [service.name, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
      description: [service.description, [Validators.required, Validators.pattern(/[0-9a-zA-Z ]{6,}/)]],
    })

    this.image = environment.useBackendImages + '/' + (service.image ? service.image.id + '_' + service.image.filename : '0_default.jpg')

  }

  reInit = () => {

    this.services[0] = new Service().deserialize({
      'id': 0,
      'name': '',
      'description': '',
      'image': new Image({
        'id': 0,
        'filename': 'default.jpg'
      })
    } as Service)

  }

  onSubmit = () => {

    this.frontImage.append('id', `${this.services[this.index].id}`)
    this.frontImage.append('name', this.serviceForm.get("name")!.value)
    this.frontImage.append('description', this.serviceForm.get("description")!.value)

    if (this.services[this.index].id === 0) {
      this.save(this.frontImage)
    } else {
      this.update(this.frontImage)
    }

  }

  save = (service: FormData) => {

    this.serviceService.postService(service).subscribe({
      next: (res: any) => {
        this.services.push(new Service().deserialize(res[0] as Service))
        this.reInit()
        this.index = this.services.length - 1
      },
      error: (error: { error: { message: any; }; }) => {
        this.errorMessage = error.error.message
      },
      complete () {
        console.log('Sauvegarde post service complete')
      }
    })

  }

  update = (service: FormData) => {

    this.serviceService.putService(service).subscribe({
      next: (res: any) => {
        this.services[this.index] = new Service().deserialize(res[0] as Service)
      },
      error: (error: { error: { message: any; }; }) => {
        this.errorMessage = error.error.message
      },
      complete () {
        console.log('Sauvegarde put service complete')
      }
    })

  }

  getServices = () => {

//    this.services.push(new Service())
    this.reInit()
    this.index = 0

    this.serviceService.getServices().subscribe({
      next: (res: any) => {
        console.log(res)
        res.forEach((service: Service) => {
          this.services.push(service)
        })
        this.initForm(this.services[this.index])
      },
      error: (error: { error: { message: any; }; }) => {
        this.errorMessage = error.error.message
        this.initForm(this.services[this.index])
      },
      complete () {
        console.log('getServices complete')
      }
    })

  }

  onServiceChange = () => {
    this.initForm(this.services[this.index])
  }

  onFileSelected = () => {

    const inputNode: any = document.querySelector('#file');

    if (inputNode.files[0]) {

      this.frontImage = new FormData();

      this.frontImage.append("garage_image", inputNode.files[0]);

      var reader = new FileReader();
      reader.readAsDataURL(inputNode.files[0]);

      reader.onload = () => {
        this.image = reader.result as string
        console.log(reader.result)
      };

    }

  }

}
