import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Service } from 'src/app/models/service.model';
import { ServiceService } from 'src/app/services/service.service';
import { environment } from 'src/environments/environment';
import { Md5 } from 'ts-md5';


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: [
    './service.component.scss'
  ]
})
export class ServiceComponent implements OnInit {

  @Input() service!: Service
  @Output() sameservice: EventEmitter<Service> = new EventEmitter();
  @Output() newservice: EventEmitter<Service> = new EventEmitter<Service>();
  @Input() state: string = "display"
  @Output() stateChange: EventEmitter<string> = new EventEmitter();

  lastService!: Service
  serviceH3Label: string = ''

  image!: string
  newImage!: string
  frontImage!: FormData
  imageClass = "image-h"

  serviceForm!: FormGroup

  isUpdated = false

  constructor(
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.initForm(this.serviceService.initService())
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('onChangesService')
    if (this.state === 'create') {
      this.initForm(this.serviceService.initService()
    )} else {
      this.initForm(this.service)
    }
  }

  ngOnDestroy(): void {
    this.quit()
  }

  quit = () => {

    if (this.isUpdated && !this.serviceForm.invalid) {

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
            this.saveService()
            break
          }
        }
      });

    }
  }

  initForm = (service: Service) => {

    this.frontImage = new FormData()

    if (service) {

      this.serviceForm = this.formBuilder.group({
        name: [
          service.name,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[a-zA-Z -\']*$/)
          ]
        ],
        description: [
          service.description,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/[0-9a-zA-Z -+*_='/]*$/),
          ]
        ],
        hash: [
          service.image.hash,
          [
            Validators.required,
          ]
        ],
      })

      if (service.image) {
        this.image = ''
        if (service.image.filename !== '') {
          this.image = environment.useBackendImages + '/' + service.image.filename
          this.imageChange()
        }
      }

      this.serviceH3Label = service ? `Service ${service.name}` : ''

      switch (this.state) {
        case 'display' : {
          this.serviceForm.disable()
          break
        }
        case 'update' : {
          this.serviceForm.enable()
          break
        }
        case 'create' : {
          this.serviceForm.enable()
          this.serviceH3Label = 'Nouvel utilisateur'
          break
        }
      }

      this.serviceForm.valueChanges.subscribe(change => {
        this.isUpdated = this.checkChanges()
      })

      this.isUpdated = false

    }

  }

  checkChanges(): boolean {
    this.isUpdated = this.service?.name !== this.serviceForm.get("name")!.value ||
    this.service?.description !== this.serviceForm.get("description")!.value ||
    this.service?.image.hash !== this.serviceForm.get("hash")!.value


    return this.isUpdated
  }

  formatService = (service: Service): Service => {

    return service.deserialize({
      id: this.serviceForm.get("id")?.value,
      name: this.serviceForm.get("name")?.value,
      description: this.serviceForm.get("description")?.value,
      image: {
        id: 0,
        filename: '',
        hash: this.serviceForm.get("hash")?.value
      }
    } as Service)

  }

  saveService = () => {

    let service = this.formatService(new Service())

    this.frontImage.append('id', `${service.id}`)
    this.frontImage.append('name', service.name)
    this.frontImage.append('description', service.description)

    if (this.state === 'create') {

      this.serviceService.postService(this.frontImage).subscribe({
        next: (res) => {
          this.newservice.emit(new Service().deserialize(res[0]))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La création du nouveau service est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la création du service`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    } else if (this.state === 'update') {

      this.serviceService.putService(this.frontImage).subscribe({
        next: (res) => {
          this.sameservice.emit(new Service().deserialize(res[0]))
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Information',
              message1: `La modification du service est effective !`,
              message2: '',
              delai: 2000
            }
          })
        },
        error: (error: { error: { message: any; }; }) => {
          this.dialog.open(MessageDialogComponent, {
            data: {
              type: 'Erreur',
              message1: `Erreur lors de la modification du service`,
              message2: error.error.message,
              delai: 0
            }
          })
        }

      })

    }
  }

  onFileSelected = () => {

    this.frontImage = new FormData()

    const inputNode: any = document.querySelector('#file');

    if (inputNode.files[0]) {

      this.frontImage.append("garage_image", inputNode.files[0]);

      var reader = new FileReader();
      reader.readAsDataURL(inputNode.files[0]);

      reader.onload = () => {
        const hash = Md5.hashStr(reader.result as string)
        this.serviceForm.get("hash")!.setValue(hash)
        this.serviceForm.get("name")!.setValue(this.serviceForm.get("name")!.value)
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
      this.sameservice.emit(this.service)
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
      this.sameservice.emit(this.service)

    })

  }

  get name() { return this.serviceForm.get('name')! as FormControl }
  get description() { return this.serviceForm.get('description')! as FormControl }

}
