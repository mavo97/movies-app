import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  movieList: Movie[];
  totalResults: number;
  loading: boolean;
  pageSize: number;
  moviesLength: number;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  pageIndex: number;
  moviesStock: Movie[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private moviesService: MoviesServiceService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.stockMovies();
    this.activatedRoute.params.subscribe(async (params) => {
      this.movie = params['movie'];
      this.movieResponse = await this.moviesService
        .searchMovie(this.movie, 1)
        .toPromise();
      this.movieList = this.movieResponse.results;
      this.totalResults = this.movieResponse.total_results;
      this.pageSize = this.movieResponse.total_pages;
      this.moviesLength = this.movieResponse.total_results;
      this.loading = false;
    });
  }

  async sliceListMovies($event: any) {
    if ($event) {
      // console.log($event);
      const index: number = $event.pageIndex;
      // console.log(index);
      this.loading = true;
      this.movieResponse = await this.moviesService
        .searchMovie(this.movie, index + 1)
        .toPromise();
      this.movieList = this.movieResponse.results;
      this.pageSize = this.movieResponse.total_pages;
      this.moviesLength = this.movieResponse.total_results;
      this.pageIndex = index;
      // console.log(this.movieResponse);
      this.loading = false;
    }
  }

  stockMovies() {
    this.moviesStock = JSON.parse(localStorage.getItem('movies'));
    // console.log(this.moviesStock);
  }
}
