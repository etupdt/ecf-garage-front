import { Component, OnInit } from '@angular/core';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Garage } from 'src/app/models/garage.model';
import { Service } from 'src/app/models/service.model';
import { GarageService } from 'src/app/services/garage.service';
import { ServiceService } from 'src/app/services/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  garage$!: Garage
  useBackendImages: string = environment.useBackendImages

  constructor(
    private garageService: GarageService,
    ) { }
 
  ngOnInit(): void {
    this.garageService.listenGarage.subscribe((garage) => {this.garage$ = garage as Garage})
  }

}
