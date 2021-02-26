import { Component, OnInit, ViewChild } from '@angular/core';
import { MoviesServiceService } from '../../providers/movies-service.service';
import { MovieResponse } from '../../models/movie-reponse.interface';
import { Movie } from '../../models/movie.interface';
import { take } from 'rxjs/operators';
import { Genre } from '../../models/genre.interface';
import { GenreResponse } from '../../models/genre-response.interface';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  listMovies: Movie[] = [];
  pageSize: number;
  totalPages: number;
  moviesLength: number;
  moviesToDisplay: Movie[] = [];
  genres: Genre[] = [];
  genreResponse: GenreResponse;
  listMoviesCopy: Movie[] = [];
  genre: boolean;
  index: number;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(private moviesService: MoviesServiceService) {}

  async ngOnInit(): Promise<void> {
    await this.getMovies();
    // console.log(this.pageSize);
    // console.log(this.listMovies);
  }

  async getMovies() {
    await this.getGenres();
    this.totalPages = await (
      await this.moviesService
        .getMoviesList(1, 'primary_release_date.desc')
        .pipe(take(1))
        .toPromise()
    ).total_pages;
    this.pageSize = this.totalPages;
    for (let i = 1; i <= this.pageSize; i++) {
      const movies = await (
        await this.moviesService
          .getMoviesList(i, 'primary_release_date.desc')
          .pipe(take(1))
          .toPromise()
      ).results;
      this.sliceListMovies(false);
      movies.forEach((movie) => this.listMovies.push(movie));
    }
    this.listMoviesCopy = this.listMovies;
    this.moviesLength = this.listMovies.length;
  }

  async getGenres() {
    this.genreResponse = await this.moviesService
      .getGenres()
      .pipe(take(1))
      .toPromise();
    this.genreResponse.genres.forEach((genre) => this.genres.push(genre));
    // console.log(this.genres);
  }

  selectGenre($event: any) {
    // console.log($event);
    this.listMoviesCopy = this.listMovies;
    if ($event.value !== undefined) {
      this.genre = true;

      this.listMoviesCopy = this.listMoviesCopy.filter((movie) => {
        const verify = movie.genre_ids.includes($event.value);
        if (verify) {
          return movie;
        }
      });
      this.pageSize = this.listMoviesCopy.length / 20;
      this.moviesLength = this.listMoviesCopy.length;
      this.sliceListMovies2(false);
      this.paginator.pageIndex = 0;
    } else {
      this.reset();
    }
  }

  sliceListMovies(scroll?: boolean, index?: number) {
    // console.log(index);
    if (index) {
      this.index = index;
      this.moviesToDisplay = this.listMovies.slice(
        index * 20,
        (index + 1) * 20
      );
    } else {
      this.moviesToDisplay = this.listMovies.slice(0, 20);
    }
    if (scroll) {
      this.goToTop();
    }
  }

  sliceListMovies2(scroll?: boolean, index?: number) {
    // console.log(index);
    if (index) {
      this.index = index;
      this.moviesToDisplay = this.listMoviesCopy.slice(
        index * 20,
        (index + 1) * 20
      );
    } else {
      this.moviesToDisplay = this.listMoviesCopy.slice(0, 20);
    }
    if (scroll) {
      this.goToTop();
    }
  }

  goToTop() {
    // console.log('gototop');
    window.scroll(0, 0);
  }

  page(index: number): number {
    return index;
  }
  reset() {
    this.genre = false;
    this.moviesToDisplay = [];
    this.listMovies = [];
    this.pageSize;
    this.moviesLength;
    this.getMovies();
  }
}
