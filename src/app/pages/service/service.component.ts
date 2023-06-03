import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { IService } from 'src/app/interface/service.interface';
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
  isUpdated = false
  errorMessage!: string

  services: Service[] = []
  serviceSelected: string = ""
  serviceActive!: Service

  image!: string
  lastImage!: string
  frontImage!: FormData
  imageClass = "image-h"

  message = ""
  selectStyle = {'visibility': 'visible'}

  buttons!: {
    label: string
    invalid: Function,
    click: Function
  }[]

  constructor(
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private serviceService: ServiceService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
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
    this.lastImage = this.image

    this.serviceForm.valueChanges.subscribe(change => {
      this.isUpdated = this.checkChanges()
    })

    this.isUpdated = false

  }

  reInit = () => {

    this.services[0] = new Service().deserialize({
      'id': 0,
      'name': '',
      'description': '',
    } as Service)

  }

  record = () => {

    if (this.isUpdated) {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          type: 'Confirmation',
          message1: `Voulez vous sauvegarder le service ?`,
          message2: "",
          delai: 0
        }
      })

      dialogRef.afterClosed().subscribe(result => {

        switch (result) {
          case 'Enregistrer' : {
            this.create()
            break
          }
          case 'Annuler' : {
            break
          }
          default : {
            this.isUpdated = false
//            this.onServiceChange()
            break
          }
        }
      });

    }
  }

  create = () => {


    this.frontImage.append('id', `${this.serviceActive.id}`)
    this.frontImage.append('name', this.serviceForm.get("name")!.value)
    this.frontImage.append('description', this.serviceForm.get("description")!.value)

    if (this.serviceActive.id === 0) {
      this.save(this.frontImage)
    } else {
      this.update(this.frontImage)
    }

  }

  save = (service: FormData) => {

    this.serviceService.postService(service).subscribe({
      next: (res: any) => {
        this.onServiceChange()
        this.serviceActive = new Service().deserialize(res[0] as Service)
        this.services.push(this.serviceActive)
        this.reInit()
        this.serviceSelected = this.serviceActive.name
        this.onServiceChange()
        this.displayMessage(0)
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

  }

  update = (service: FormData) => {

    this.serviceService.putService(service).subscribe({
      next: (res: any) => {
        this.onServiceChange()
        this.serviceActive = new Service().deserialize(res[0] as Service)
        this.services[this.services.findIndex(service => service.name === this.serviceSelected)]
          = this.serviceActive
        this.serviceSelected = this.serviceActive.name
        this.onServiceChange()
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

  delete = () => {

    let index = this.services.findIndex(service => service.name === this.serviceSelected)

    this.serviceService.deleteService(this.serviceActive.id).subscribe({
      next: (res: any) => {

        this.services = this.services.filter(service => service.name !== this.serviceSelected)
        index = index < this.services.length - 1 ? index : index - 1
        this.serviceSelected = this.services[index].name
        this.onServiceChange()
        this.displayMessage(0)

      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la suppression du service`,
            message2: error.error.message,
            delai: 0
          }
        })
      },
      complete () {
        console.log('Sauvegarde put service complete')
      }
    })

  }


  getServices = () => {

//    this.services.push(new Service())

    this.reInit()

    this.serviceService.getServices().subscribe({
      next: (res: any) => {
        res.forEach((service: Service) => {
          this.services.push(service)
        })
        this.displayMessage(0)
        this.onServiceChange()
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la récupération des services`,
            message2: error.error.message,
            delai: 0
          }
        })
      },
      complete () {
        console.log('getServices complete')
      }
    })

  }

  onServiceChange = () => {
    this.serviceActive = this.services.find(service => service.name === this.serviceSelected)!
    this.initForm(this.serviceActive)
    this.imageChange()
    this.displayMessage(0)
  }

  onFileSelected = () => {

    const inputNode: any = document.querySelector('#file');

    if (inputNode.files[0]) {

      this.frontImage.append("garage_image", inputNode.files[0]);

      var reader = new FileReader();
      reader.readAsDataURL(inputNode.files[0]);

      reader.onload = () => {
        this.image = reader.result as string
        this.imageChange()
      };

    }

  }

  ngOnDestroy(): void {
//    this.record()
  }

  imageChange = () => {

    let img = new Image()
    img.src = this.image

    this.isUpdated = true

    img.onload = () => {
      this.imageClass = img.width > img.height ? "image-h" : "image-v"
    };

  }

  checkChanges = () => {
    return this.image !== this.lastImage ||
      this.serviceForm.get("name")!.value !== this.serviceActive.name ||
      this.serviceForm.get("description")!.value !== this.serviceActive.description

  }

  displayMessage = (phase: number) => {

    if (phase === 0) {
      this.frontImage = new FormData();
      this.selectStyle = {'visibility': 'visible'}
      if (this.serviceForm)
        this.serviceForm.disable()
      this.buttons = [
        {
          label: "Créer",
          invalid: ()  => {return false},
          click: () => {
            this.serviceSelected = ""
            this.onServiceChange()
            this.displayMessage(1)
          }
        }
      ]

      if (this.services.length === 1) {

        this.serviceSelected = this.services[0].name
        this.message = "Vous pouvez créer un nouveau service avec le bouton 'Créer'"
        this.selectStyle = {'visibility': 'hidden'}

      } else {

        if (this.serviceSelected !== "") {
          this.buttons.push(
            {
              label: "Modifier",
              invalid: ()  => {return false},
              click: () => {
                this.serviceForm.enable()
                this.displayMessage(1)
                this.isUpdated = false
              }
            }
          )
          this.buttons.push(
            {
              label: "Supprimer",
              invalid: ()  => {return false},
              click: () => {
                this.delete()
              }
            }
          )
        }

        this.message = "Sélectionnez un service existant ou créez en un avec le bouton 'Créer'"

      }

    }

    if (phase === 1) {
      this.selectStyle = {'visibility': 'hidden'}
      this.serviceForm.enable()
      this.buttons = [
        {
          label: "Enregistrer",
          invalid: () => {return !this.isUpdated || this.serviceForm.invalid || this.image === `${environment.useBackendImages}/0_default.jpg`},
          click: () => {
            this.create()
          }
        },
        {
          label: "Abandonner",
          invalid:  ()  => {return false},
          click: () => {
//            this.record()
          }
        },
      ]
    }

  }

}
