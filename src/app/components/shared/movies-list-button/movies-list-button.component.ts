import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../providers/local-storage.service';

@Component({
  selector: 'app-movies-list-button',
  templateUrl: './movies-list-button.component.html',
  styleUrls: ['./movies-list-button.component.css'],
})
export class MoviesListButtonComponent implements OnInit {
  itemsNumber: number = 0;

  constructor(private _localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this._localStorageService.subjectListItems.subscribe((items) => {
      this.itemsNumber = items;
      console.log(items);
    });
  }

  saveList() {
    console.log('HOLA');
  }
}
