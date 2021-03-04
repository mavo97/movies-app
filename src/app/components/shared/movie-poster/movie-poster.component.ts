import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../../../models/movie.interface';

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

  time: number;
  movieTime: number;
  constructor() {}

  ngOnInit(): void {
    this.time = new Date().getTime() - 5.256e9;
    this.movieTime = new Date(this.release_date).getTime();
    // console.log(this.movieTime, this.time);
    // console.log(this.time > this.movieTime ? true : false);
  }

  inStock(movies: Movie[], id: number): Boolean {
    const found = movies.find((movie) => movie.id === id);
    return found !== undefined ? true : false;
  }
}
