import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Service } from 'src/app/models/service.model';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: [
    './services.component.scss']
})
export class ServicesComponent implements OnInit {

  constructor(
    private serviceService: ServiceService,
    public dialog: MatDialog,
  ) { }

  services!: Service[]

  selectedService: Service = this.serviceService.initService()
  newService!: Service
  parentState: string = 'display'

  ngOnInit(): void {

    this.serviceService.getServices().subscribe({
      next: (res: Service[]) => {
        this.services = res
        if (this.services[0])
          this.selectedService = this.services[0]
        else
          this.serviceService.initService()
      },
      error: (error: { error: { message: any; }; }) => {
        this.dialog.open(MessageDialogComponent, {
          data: {
            type: 'Erreur',
            message1: `Erreur lors de la lecture des services`,
            message2: error.error.message,
            delai: 0
          }
        })
      }

    })
  }

  displayedColumns: string[] = ['name', 'description', 'update', 'delete']
  dataSource = new MatTableDataSource(this.services);

  applyFilter(event: Event) {
    console.log((event.target as HTMLInputElement).value)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isSelectedClass = (index: number) => {
    return this.selectedService?.name === this.services[index].name && this.parentState !== 'create' ? "selected" : ""
  }

  isSelectedStyle = (index: number) => {
    return this.selectedService.name === this.services[index].name && this.parentState !== 'create' ? {'background': '#D9777F'} : []
  }

  displayService = (index: number) => {
    if (this.parentState === 'display') {
      this.selectedService = this.services[index]
    }
  }

  updateService = (service: Service) => {
    if (['update', 'create'].indexOf(this.parentState) < 0) {
      this.selectedService = service
      this.parentState = 'update'
    }
  }

  deleteService = (service: Service) => {
    if (['update', 'create'].indexOf(this.parentState) < 0) {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          type: 'Confirmation',
          message1: `Désirez vous réellement supprimer cet utilisateur ?`,
          message2: "",
          buttons: ['Supprimer', 'Annuler']
        }
      })

      dialogRef.afterClosed().subscribe(result => {

        if (result !== 'Supprimer')
          return

        this.selectedService = service
        this.parentState = 'delete'

        if (service.id === 0) {
          this.deleteInDatasource()
          return
        }

        this.serviceService.deleteService(service.id).subscribe({
          next: (res) => {
            this.deleteInDatasource()
            this.dialog.open(MessageDialogComponent, {
              data: {
                type: 'Information',
                message1: `La suppression du service est effective !`,
                message2: '',
                delai: 2000
              }
            })
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
          }
        })
      })
    }
  }

  deleteInDatasource = () => {
    const index = this.services.findIndex(service => service.id === this.selectedService?.id)
    this.services.splice(index, 1)
    this.updateDatasource()
    if (this.services.length === 0)
      this.selectedService = this.serviceService.initService()
    else
      this.selectedService = index > this.services.length - 1 ? this.services[index -1] : this.services[index]
    this.parentState = 'display'
  }

  onNewservice = (service: Service) => {
    this.services.push(service);
    this.selectedService = this.services[this.services.length - 1]
    this.updateDatasource()
    this.parentState = 'display'
  }

  onSameservice = (service: Service) => {
    this.services[this.services.findIndex(service => service.id === this.selectedService?.id)] = service
    this.selectedService = service
    this.updateDatasource()
    this.parentState = 'display'
  }

  createService = () => {
    this.parentState = 'create'
  }

  updateDatasource = () => {
    let newServices: Service[] = []
    this.services.forEach(service => newServices.push(service))
    this.services = newServices
    this.dataSource.connect().next(this.services)
  }

}
