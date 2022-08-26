import { Component, OnInit, ViewChild } from '@angular/core';
import { MoviesServiceService } from '../../providers/movies-service.service';
import { Movie } from '../../models/movie.interface';
import { take } from 'rxjs/operators';
import { Genre } from '../../models/genre.interface';
import { GenreResponse } from '../../models/genre-response.interface';
import { MatPaginator } from '@angular/material/paginator';
import { LocalStorageService } from '../../providers/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { EditListComponent } from '../shared/edit-list/edit-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  listMovies: Movie[] = [];
  trendingMovies: Movie[] = [];
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
  currentPage: number = 0;
  pagesArray: number[] = [];
  pagesArray2: number[] = [];
  sortOptions: any[] = [
    { id: 0, value: 'Agregadas recientemente' },
    { id: 1, value: 'Fecha de estreno' },
    { id: 2, value: 'Mejor valoradas' },
    { id: 3, value: 'Orden alfabetico' },
  ];
  orderBy: number = 0;
  total_results: number = 0;

  constructor(
    private moviesService: MoviesServiceService,
    private lsService: LocalStorageService,
    public _dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getGenres();
    await this.moviesStorage();
  }

  async getMovies() {
    this.loading = true;
    const data: any = await await this.moviesService
      .getMoviesList(1, 'original_order.desc')
      .pipe(take(1))
      .toPromise();
    this.totalPages = data.total_pages;
    this.total_results = data.total_results;
    this.pageSize = this.totalPages;
    this.pagesArray = Array.from(Array(this.totalPages).keys());
    console.log(this.pagesArray, 'PAGES ARRAY');
    for (let i = 1; i <= this.pageSize; i++) {
      const movies = await (
        await this.moviesService
          .getMoviesList(i, 'original_order.desc')
          .pipe(take(1))
          .toPromise()
      ).results;
      this.sliceListMovies(false);
      movies.forEach((movie) => this.listMovies.push(movie));
      const movies2 = movies;
      movies2.forEach((movie) => this.trendingMovies.push(movie));
    }
    this.listMovies = this.mappingMovies(this.listMovies);
    this.listMoviesCopy = this.listMovies;

    this.trendingMovies.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return (
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      );
    });
    // console.log(this.trendingMovies);
    this.moviesLength = this.listMovies.length;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.lsService.setItem('movies', JSON.stringify(this.listMovies));
    this.lsService.setItem('total_pages', JSON.stringify(this.totalPages));
    this.lsService.setItem('finished', JSON.stringify(true));
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
      this.totalPages = Math.ceil(this.listMoviesCopy.length / 20);
      this.pagesArray2 = Array.from(Array(this.totalPages).keys());
      this.sliceListMovies2(false);
      this.paginator &&
        this.paginator.pageIndex &&
        (this.paginator.pageIndex = 0);
    } else {
      // this.moviesStorage();
      this.genre = false;
      this.listMoviesCopy = JSON.parse(localStorage.getItem('movies'));
      this.listMovies = this.listMoviesCopy;
      this.totalPages = parseInt(
        JSON.parse(this.lsService.getItem('total_pages'))
      );
      this.pagesArray = Array.from(Array(this.totalPages).keys());
      console.log('ORDER BY', { value: this.orderBy });
      this.sortBy({ value: this.orderBy });
      this.paginator &&
        this.paginator.pageIndex &&
        (this.paginator.pageIndex = 0);
    }
  }

  sliceListMovies(scroll?: boolean, index?: number) {
    console.log(index, 'INDEX');
    // console.log(index);
    if (index) {
      this.index = index;
      this.moviesToDisplay = this.listMovies.slice(
        index * 20,
        (index + 1) * 20
      );
    } else {
      this.index = 0;
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
      this.index = 0;
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
    this.trendingMovies = [];
    localStorage.clear();
    this.getMovies();
  }

  async moviesStorage() {
    let movies: Movie[] = JSON.parse(this.lsService.getItem('movies'));
    const total_pages: number = parseInt(
      JSON.parse(this.lsService.getItem('total_pages'))
    );
    let movies2: Movie[] = JSON.parse(this.lsService.getItem('movies'));
    const moviesData: any = await this.moviesService
      .getMoviesList(1, 'original_order.desc')
      .pipe(take(1))
      .toPromise();

    if (movies && Number(moviesData.total_results) === Number(movies.length)) {
      if (movies !== null && total_pages !== null) {
        this.listMovies = movies;
        this.listMoviesCopy = this.listMovies;
        this.moviesLength = this.listMovies.length;
        this.totalPages = total_pages;
        this.pagesArray = Array.from(Array(this.totalPages).keys());
        console.log(this.pagesArray, 'PAGES ARRAY');
        this.trendingMovies = movies2;
        this.trendingMovies.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return (
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
          );
        });
        console.log(this.trendingMovies.slice(0, 18));
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

  openDialog() {
    const dialogRef = this._dialog.open(EditListComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  sortBy(event) {
    if (event.value === 0) {
      this.listMoviesCopy = JSON.parse(localStorage.getItem('movies'));
      this.listMovies = this.listMoviesCopy;
    }
    if (event.value === 1) {
      this.listMovies = this.listMovies.sort((a, b) => {
        const date = new Date(a.release_date).getTime();
        const date2 = new Date(b.release_date).getTime();
        return date2 - date;
      });
    }
    if (event.value === 2) {
      this.listMovies = this.listMovies.sort((a, b) => {
        const value = a.vote_average;
        const value2 = b.vote_average;
        return value2 - value;
      });
    }
    if (event.value === 3) {
      this.listMovies = this.listMovies.sort((a, b) => {
        const textA = a.title.toUpperCase();
        const textB = b.title.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
    }
    this.orderBy = event.value;
    this.sliceListMovies(true, 0);
  }

  mappingMovies(movies: Movie[]): Movie[] {
    const moviesOne = movies.slice(0, 20);
    let moviesTwo = movies.filter((movie) => {
      const findMovie = moviesOne.find((m) => m.id === movie.id);
      if (!findMovie) {
        return movie;
      }
    });
    moviesTwo = moviesTwo.sort((a, b) => {
      const date = new Date(a.release_date).getTime();
      const date2 = new Date(b.release_date).getTime();
      return date2 - date;
    });
    const finalMovies = moviesOne.concat(moviesTwo);
    return finalMovies;
  }
}
