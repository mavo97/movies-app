import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../../models/movie.interface';
import { LocalStorageService } from '../../../../providers/local-storage.service';

@Component({
  selector: 'app-dialoglistcontent',
  templateUrl: './dialoglistcontent.component.html',
  styleUrls: ['./dialoglistcontent.component.css'],
})
export class DialoglistcontentComponent implements OnInit {
  moviesList: Movie[] = [];

  constructor(private _localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    console.log('open');
    this.moviesList = JSON.parse(localStorage.getItem('moviesSelected'));
  }

  deleteItem(id: number) {
    this.moviesList = this.moviesList.filter((movie) => movie.id !== id);
    localStorage.setItem('moviesSelected', JSON.stringify(this.moviesList));
    this._localStorageService.subjectChangeStatus(this.moviesList.length);
  }
}
