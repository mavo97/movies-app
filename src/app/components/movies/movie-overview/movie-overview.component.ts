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
  videos: Trailer[] = [];
  loading: boolean;
  dialogIsOpen: boolean;

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

    this.videos = (
      await this.movieService.getVideoId(this.movieId).pipe(take(1)).toPromise()
    ).results;

    this.video = this.getOfficialTrailer();

    this.loading = false;
  }

  openDialog() {
    this.dialogIsOpen = true;
    const dialogRef = this.dialog.open(DialogVideoComponent, {
      disableClose: true,
      data: {
        videoKey: this.video.key,
        videoName: this.video.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogIsOpen = false;
    });
  }

  // Regresar una pagina atrás
  return() {
    window.history.back();
  }

  getOfficialTrailer(): Trailer {
    const officialTrailer: Trailer = this.videos.find(
      (v) => v.name === 'Official Trailer'
    );

    if (officialTrailer) {
      return officialTrailer;
    }

    return this.videos[0];
  }
}
