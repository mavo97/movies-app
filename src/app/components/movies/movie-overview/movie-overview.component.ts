import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { MoviesServiceService } from '../../../providers/movies-service.service';
import { Movie } from '../../../models/movie.interface';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-movie-overview',
  templateUrl: './movie-overview.component.html',
  styleUrls: ['./movie-overview.component.css'],
})
export class MovieOverviewComponent implements OnInit {
  movieId: number;
  movie: Movie;
  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'determinate';
  value: number;
  constructor(
    private routeActivated: ActivatedRoute,
    private movieService: MoviesServiceService
  ) {}

  ngOnInit(): void {
    this.getMovieInfo();
  }

  async getMovieId() {
    const response = await this.routeActivated.params.pipe(take(1)).toPromise();
    return response;
  }

  async getMovieInfo() {
    await this.getMovieId().then((params) => (this.movieId = +params.id));

    this.movie = await this.movieService
      .getMovie(this.movieId)
      .pipe(take(1))
      .toPromise();
    this.value = Math.round(this.movie.vote_average * 10);
    console.log(this.movie);
  }
}
