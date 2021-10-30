import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../../../models/movie.interface';
import { LocalStorageService } from '../../../providers/local-storage.service';

@Component({
  selector: 'app-movie-poster',
  templateUrl: './movie-poster.component.html',
  styleUrls: ['./movie-poster.component.css'],
})
export class MoviePosterComponent implements OnInit {
  @Input() vote_average: number;
  @Input() imgSrc: string;
  @Input() release_date: string;
  @Input() movies: Movie[];
  @Input() idCompare: number;
  @Input() idExist: number;
  @Input() id: number;
  @Input() selectButton: boolean = false;

  time: number;
  movieTime: number;
  moviesSelectedArray: Movie[] = [];

  constructor(private _localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.time = new Date().getTime() - 5.256e9;
    this.movieTime = new Date(this.release_date).getTime();
    // console.log(this.movieTime, this.time);
    // console.log(this.time > this.movieTime ? true : false);
    this.getItemsStatus();
  }

  inStock(movies: Movie[], id: number): Boolean {
    const found = movies.find((movie) => movie.id === id);
    return found !== undefined ? true : false;
  }

  selectMovie(id: number) {
    const moviesSelectedStorage: Movie[] = JSON.parse(
      localStorage.getItem('moviesSelected')
    );

    if (!this.itemSelected(id)) {
      const moviesStorage: Movie[] = JSON.parse(localStorage.getItem('movies'));
      const movie: Movie = moviesStorage.find((movie) => movie.id === id);

      let moviesToSave = [];
      if (moviesSelectedStorage) {
        moviesToSave = moviesSelectedStorage;
        moviesToSave.push(movie);
        localStorage.setItem('moviesSelected', JSON.stringify(moviesToSave));
      } else {
        moviesToSave.push(movie);
        localStorage.setItem('moviesSelected', JSON.stringify(moviesToSave));
      }
    } else {
      localStorage.setItem(
        'moviesSelected',
        JSON.stringify(moviesSelectedStorage.filter((movie) => movie.id !== id))
      );
    }
    console.log(moviesSelectedStorage.length);
    this._localStorageService.subjectChangeStatus(
      JSON.parse(localStorage.getItem('moviesSelected')).length
    );
  }

  itemSelected(id: number): boolean {
    const moviesSelectedStorage: Movie[] = JSON.parse(
      localStorage.getItem('moviesSelected')
    );
    if (moviesSelectedStorage) {
      const movie = moviesSelectedStorage.find((m) => m.id === id);
      if (movie) {
        return true;
      }
      return false;
    }
    return false;
  }

  getItemsStatus() {
    const moviesSelectedStorage: Movie[] = JSON.parse(
      localStorage.getItem('moviesSelected')
    );
    this._localStorageService.subjectChangeStatus(moviesSelectedStorage.length);
  }
}
