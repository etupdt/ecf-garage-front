import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Photo } from 'src/app/interface/photo.interface';
import { Image } from 'src/app/models/image.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  @Input() photos: Photo[] = []
  @Output() samephotos: EventEmitter<Photo[]> = new EventEmitter();
  @Input() state: string = "display"

  useBackendImages = ''

  constructor() { }

  ngOnInit(): void {
    this.useBackendImages = environment.useBackendImages + '/'
  }

  deletePhoto = (index: number) => {
    this.photos.splice(index, 1)
    this.samephotos.emit(this.photos)
  }

}
