import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Movie } from '../../../../models/movie.interface';
import { LocalStorageService } from '../../../../providers/local-storage.service';

@Component({
  selector: 'app-dialoglistcontent',
  templateUrl: './dialoglistcontent.component.html',
  styleUrls: ['./dialoglistcontent.component.css'],
})
export class DialoglistcontentComponent implements OnInit {
  moviesList: Movie[] = [];
  form: FormGroup;

  constructor(private _localStorageService: LocalStorageService) {
    this.form = new FormGroup({
      mobile: new FormControl('', [
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^(0|[1-9][0-9]*)$'),
      ]),
    });
  }

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
