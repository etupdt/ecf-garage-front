import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogMessage } from 'src/app/interface/message.interface';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMessage,
  ) {}

  ngOnInit(): void {
    if (this.data.delai !== 0) {
      const interval = setInterval(() => {
        this.dialogRef.close();
      },this.data.delai)
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
