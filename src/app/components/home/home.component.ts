import { Component, OnInit } from '@angular/core';
import { MoviesServiceService } from '../../providers/movies-service.service';
import { MovieResponse } from '../../models/movie-reponse.interface';
import { Movie } from '../../models/movie.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  listMovies: Movie[] = [];
  pageSize: number;
  moviesLength: number;
  moviesToDisplay: Movie[] = [];
  constructor(private moviesService: MoviesServiceService) {}

  async ngOnInit(): Promise<void> {
    await this.getMovies();
    // console.log(this.pageSize);
    // console.log(this.listMovies);
  }

  async getMovies() {
    this.pageSize = await (
      await this.moviesService
        .getMoviesList(1, 'primary_release_date.desc')
        .pipe(take(1))
        .toPromise()
    ).total_pages;

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
    this.moviesLength = this.listMovies.length;
  }

  sliceListMovies(scroll?: boolean, index?: number) {
    // console.log(index);
    if (index) {
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

  goToTop() {
    // console.log('gototop');
    window.scroll(0, 0);
  }
}
