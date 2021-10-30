import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../providers/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { DialoglistcontentComponent } from './dialoglistcontent/dialoglistcontent.component';

@Component({
  selector: 'app-movies-list-button',
  templateUrl: './movies-list-button.component.html',
  styleUrls: ['./movies-list-button.component.css'],
})
export class MoviesListButtonComponent implements OnInit {
  itemsNumber: number = 0;
  constructor(
    private _localStorageService: LocalStorageService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._localStorageService.subjectListItems.subscribe((items) => {
      this.itemsNumber = items;
      console.log(items);
    });
  }

  saveList() {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialoglistcontentComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
