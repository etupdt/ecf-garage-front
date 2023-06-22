import { Component, OnInit } from '@angular/core';
import { MessageDialogComponent } from 'src/app/dialogs/message-dialog/message-dialog.component';
import { Garage } from 'src/app/models/garage.model';
import { Service } from 'src/app/models/service.model';
import { CommentService } from 'src/app/services/comment.service';
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

  selectedComment!: Comment
  selectedIndex: number = 0
  newComment!: Comment
  parentState: string = 'display'

  constructor(
    private garageService: GarageService,
    private commentService: CommentService,
    ) { }

  ngOnInit(): void {
    this.garageService.listenGarage.subscribe((garage) => {
      this.garage$ = garage as Garage
    })
  }

  onNewcomment = (comment: Comment) => {
  }

}
