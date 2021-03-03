import { Component, OnInit, ViewChild } from '@angular/core';
import { MoviesServiceService } from '../../providers/movies-service.service';
import { Movie } from '../../models/movie.interface';
import { take } from 'rxjs/operators';
import { Genre } from '../../models/genre.interface';
import { GenreResponse } from '../../models/genre-response.interface';
import { MatPaginator } from '@angular/material/paginator';
import { LocalStorageService } from '../../providers/local-storage.service';

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
  loading: boolean;
  constructor(
    private moviesService: MoviesServiceService,
    private lsService: LocalStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getGenres();
    await this.moviesStorage();

    // console.log(this.pageSize);
    // console.log(this.listMovies);
  }

  async getMovies() {
    this.loading = true;
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
    this.loading = false;
    this.lsService.setItem('movies', JSON.stringify(this.listMovies));
    this.lsService.setItem('total_pages', JSON.stringify(this.totalPages));
    this.setExpiryStorage();
  }

  async getGenres() {
    this.genreResponse = await this.moviesService
      .getGenres()
      .pipe(take(1))
      .toPromise();
    await this.genreResponse.genres.forEach((genre) => this.genres.push(genre));

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
      this.moviesStorage();
      this.paginator.pageIndex = 0;
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
    this.listMoviesCopy = [];
    this.getMovies();
  }

  async moviesStorage() {
    let movies: Movie[] = JSON.parse(this.lsService.getItem('movies'));
    const total_pages: number = parseInt(
      JSON.parse(this.lsService.getItem('total_pages'))
    );
    if (!this.lsService.compareTime()) {
      if (movies !== null && total_pages !== null) {
        this.listMovies = movies;
        this.listMoviesCopy = this.listMovies;
        this.moviesLength = this.listMovies.length;
        this.totalPages = total_pages;
        this.sliceListMovies(false, 0);
      } else {
        await this.getMovies();
      }
    } else {
      await localStorage.clear();
      await this.getMovies();
    }
  }

  setExpiryStorage() {
    this.lsService.setExpiry();
  }
}
