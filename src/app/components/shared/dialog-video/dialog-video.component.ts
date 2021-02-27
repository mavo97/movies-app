import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface DialogData {
  videoKey: string;
  videoName: string;
}
@Component({
  selector: 'app-dialog-video',
  templateUrl: './dialog-video.component.html',
  styleUrls: ['./dialog-video.component.css'],
})
export class DialogVideoComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {}
}
