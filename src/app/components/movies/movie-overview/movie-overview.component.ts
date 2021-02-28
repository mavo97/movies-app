import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { MoviesServiceService } from '../../../providers/movies-service.service';
import { Movie } from '../../../models/movie.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogVideoComponent } from '../../shared/dialog-video/dialog-video.component';
import { Trailer } from '../../../models/movie-video.interface';

@Component({
  selector: 'app-movie-overview',
  templateUrl: './movie-overview.component.html',
  styleUrls: ['./movie-overview.component.css'],
})
export class MovieOverviewComponent implements OnInit {
  movieId: number;
  movie: Movie;
  value: number;
  video: Trailer;
  loading: boolean;
  constructor(
    private routeActivated: ActivatedRoute,
    private movieService: MoviesServiceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovieInfo();
  }

  async getMovieId() {
    const response = await this.routeActivated.params.pipe(take(1)).toPromise();
    return response;
  }

  async getMovieInfo() {
    this.loading = true;
    await this.getMovieId().then((params) => (this.movieId = +params.id));

    this.movie = await this.movieService
      .getMovie(this.movieId)
      .pipe(take(1))
      .toPromise();
    this.value = Math.round(this.movie.vote_average * 10);
    this.video = (
      await this.movieService.getVideoId(this.movieId).pipe(take(1)).toPromise()
    ).results[0];
    this.loading = false;
  }

  openDialog() {
    this.dialog.open(DialogVideoComponent, {
      data: {
        videoKey: this.video.key,
        videoName: this.video.name,
      },
    });
  }
}
