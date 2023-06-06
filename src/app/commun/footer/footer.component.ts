import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Garage } from 'src/app/models/garage.model';
import { GarageService } from 'src/app/services/garage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: [
    './footer.component.scss',
  ]
})
export class FooterComponent implements OnInit {

  garage!: Garage

  reseaux = [
    {
      title: 'Facebook',
      href: 'https://www.facebook.com',
      img: 'icon-facebook icon'
    },
    {
      title: 'Twitter',
      href: 'https://twitter.com',
      img: 'icon-twitter icon'
    },
    {
      title: 'Instagram',
      href: 'https://www.instagram.com',
      img: 'icon-instagram icon'
    },
  ]
  constructor(
    private garageService: GarageService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getGarage()
  }

  getGarage = () => {

    this.garageService.getGarageById(6).subscribe({
      next: (res: any) => {
        this.garage = new Garage().deserialize(res);
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
      }
    })

  }

}
