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
  constructor(private moviesService: MoviesServiceService) {}

  ngOnInit(): void {
    this.getMoviesList();
  }

  getMoviesList($event?: any) {
    // console.log($event);
    const index = 1;
    if ($event) {
      this.getMovies($event.pageIndex > 0 ? index + $event.pageIndex : 1);
    } else {
      this.getMovies();
    }
  }

  getMovies(index?: number) {
    // console.log(index);
    this.goToTop();

    this.moviesService
      .getMoviesList(index, 'primary_release_date.desc')
      .pipe(take(1))
      .subscribe((data: MovieResponse) => {
        // console.log(index);
        this.listMovies = data.results;
        this.pageSize = data.total_pages;
        this.moviesLength = data.total_results;
        // console.log(data);
      });
  }

  goToTop() {
    // console.log('gototop');
    window.scroll(0, 0);
  }
}
