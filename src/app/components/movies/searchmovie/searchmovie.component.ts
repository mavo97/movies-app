import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesServiceService } from '../../../providers/movies-service.service';
import { Movie } from '../../../models/movie.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MovieResponse } from '../../../models/movie-reponse.interface';

@Component({
  selector: 'app-searchmovie',
  templateUrl: './searchmovie.component.html',
  styleUrls: ['./searchmovie.component.css'],
})
export class SearchmovieComponent implements OnInit {
  movie: string;
  movieResponse: MovieResponse;
  movieList: Movie[] = [];
  totalResults: number;
  loading: boolean;
  pageSize: number;
  moviesLength: number;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  pageIndex: number;
  moviesStock: Movie[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private moviesService: MoviesServiceService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.stockMovies();
    this.activatedRoute.params.subscribe(async (params) => {
      this.movie = params['movie'];
      this.movieList = this._filter(this.movie);
      this.loading = false;
    });
  }

  stockMovies() {
    this.moviesStock = JSON.parse(localStorage.getItem('movies'));
  }

  private _filter(value: string): Movie[] {
    // Normalizamos el texto eliminando acentos, caracteres especiales y espacios.
    const normalizeString = (str: string) =>
      str
        .normalize('NFD') // Descompone caracteres acentuados.
        .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (acentos).
        .replace(/[^a-zA-Z0-9]/g, '') // Elimina caracteres especiales y espacios.
        .toLowerCase();

    // Normalizamos y dividimos el valor de búsqueda.
    const filterValues = normalizeString(value)
      .split(' ')
      .filter((val) => val.trim() !== '');

    if (filterValues.length === 0) {
      return [];
    }

    // Filtramos las opciones utilizando la versión normalizada de los títulos.
    const filteredOptions = this.moviesStock.filter((option) => {
      const optionTitleLower = normalizeString(option.title);
      return filterValues.every((filter) => optionTitleLower.includes(filter));
    });

    return filteredOptions
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, 12);
  }

  return() {
    this._router.navigate(['/']);
  }
}
