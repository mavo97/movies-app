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
import { ActivatedRoute, Route, Router } from '@angular/router';

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
  pageId: number = 1;
  genreSelected: number | string;
  genreSelectedCopy: number | string;
  loadingPaginator: boolean;
  loadingMovies: boolean;

  constructor(
    private moviesService: MoviesServiceService,
    private lsService: LocalStorageService,
    public _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this._route.params.subscribe((params) => {
      this.pageId = Number(params['id']) || 1;
      this.loadingMovies = true;
      this.validateIfExistGenreParam();
    });
    this.loadingMovies = true;
    await this.getGenres();
    await this.moviesStorage();
  }

  async getMovies() {
    this.loading = true;

    const data: any = await this.moviesService
      .getMoviesList(1, 'original_order.desc')
      .pipe(take(1))
      .toPromise();

    this.totalPages = data.total_pages;
    this.total_results = data.total_results;
    this.pageSize = this.totalPages;
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);

    const moviePromises = Array.from({ length: this.pageSize }, (_, i) =>
      this.moviesService
        .getMoviesList(i + 1, 'original_order.desc')
        .pipe(take(1))
        .toPromise()
    );

    const allMovies = await Promise.all(moviePromises);

    this.listMovies = allMovies
      .map((page) => page.results)
      .reduce((acc, val) => acc.concat(val), []);
    this.trendingMovies = [...this.listMovies];

    this.listMovies = this.mappingMovies(this.listMovies);
    this.trendingMovies.sort(
      (a, b) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );

    this.listMoviesCopy = this.listMovies;
    this.moviesLength = this.listMovies.length;

    setTimeout(() => {
      this.loading = false;
    }, 100);

    this.sliceListMovies(true, this.pageId - 1);

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
  }

  selectGenre($event: any, fromSelect?: boolean) {
    this.loadingPaginator = true;
    this.loadingMovies = true;
    this.listMoviesCopy = this.listMovies;

    if ($event !== undefined && $event !== 0) {
      let resetPages: boolean;
      if (fromSelect && $event !== this.genreSelected) {
        resetPages = true;
      }

      this.genre = true;
      this.genreSelected = $event;

      this.listMoviesCopy = this.listMoviesCopy.filter((movie) => {
        const verify = movie.genre_ids.includes($event);
        if (verify) {
          return movie;
        }
      });
      this.pageSize = this.listMoviesCopy.length / 20;
      this.moviesLength = this.listMoviesCopy.length;
      this.totalPages = Math.ceil(this.listMoviesCopy.length / 20);
      this.pagesArray2 = Array.from(Array(this.totalPages).keys());

      this.sliceListMoviesByGenre(true, resetPages ? 0 : this.pageId - 1);
      if (resetPages) {
        this._router.navigate([`/page/1`], {
          queryParams: { genre: this.genreSelected },
        });
      }
    } else {
      // this.moviesStorage();
      this.genre = false;
      this.listMoviesCopy = JSON.parse(localStorage.getItem('movies'));
      this.listMovies = this.listMoviesCopy;
      this.totalPages = parseInt(
        JSON.parse(this.lsService.getItem('total_pages'))
      );
      this.pagesArray = Array.from(Array(this.totalPages).keys());
      this.sortBy({ value: this.orderBy });
      this._router.navigate(['/page', 1]);
    }

    setTimeout(() => {
      this.loadingPaginator = false;
    }, 100);
  }

  sliceListMovies(scroll: boolean = false, index: number = 0) {
    this.index = index;
    this.moviesToDisplay = this.listMovies.slice(index * 20, (index + 1) * 20);
    this.loadingMovies = false;

    if (scroll) {
      this.goToTop();
    }
  }

  sliceListMoviesByGenre(scroll: boolean = false, index: number = 0) {
    this.index = index;
    this.moviesToDisplay = this.listMoviesCopy.slice(
      index * 20,
      (index + 1) * 20
    );
    this.loadingMovies = false;

    if (scroll) {
      this.goToTop();
    }
  }

  goToTop() {
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
    const movies: Movie[] = JSON.parse(this.lsService.getItem('movies'));
    const totalPages: number = parseInt(
      this.lsService.getItem('total_pages'),
      10
    );
    const moviesData: any = await this.moviesService
      .getMoviesList(1, 'original_order.desc')
      .pipe(take(1))
      .toPromise();

    const moviesAreValid =
      movies && Number(moviesData.total_results) === movies.length;

    if (moviesAreValid && totalPages) {
      this.listMovies = movies;
      this.listMoviesCopy = [...movies];
      this.moviesLength = movies.length;
      this.totalPages = totalPages;
      this.pagesArray = Array.from({ length: totalPages }, (_, i) => i);

      this.trendingMovies = [...movies].sort((a, b) => {
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
      });

      this.validateIfExistGenreParam();
    } else {
      this._router.navigate(['/']);
      await localStorage.clear();
      await this.getMovies();
    }
  }

  validateIfExistGenreParam(): void {
    this._route.queryParams.subscribe((queryParams) => {
      const genre = queryParams['genre']
        ? Number(queryParams['genre'])
        : undefined;
      if (genre) {
        this.genre = true;
        this.genreSelected = Number(genre);
        this.selectGenre(this.genreSelected);
      } else {
        this.genre = false;
        this.sliceListMovies(true, this.pageId - 1);
      }
    });
  }

  setExpiryStorage() {
    this.lsService.setExpiry();
  }

  openDialog() {
    const dialogRef = this._dialog.open(EditListComponent);

    dialogRef.afterClosed().subscribe((result) => {});
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

  goToPage(id: number) {
    this._router.navigate(['/page', id]);
  }
}
