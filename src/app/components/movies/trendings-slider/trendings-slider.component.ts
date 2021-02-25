import { Component, OnInit } from '@angular/core';
import { MoviesServiceService } from '../../../providers/movies-service.service';
import { MovieResponse } from '../../../models/movie-reponse.interface';
import { Movie } from '../../../models/movie.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-trendings-slider',
  templateUrl: './trendings-slider.component.html',
  styleUrls: ['./trendings-slider.component.css'],
})
export class TrendingsSliderComponent implements OnInit {
  trendingMovies: Movie[] = [];
  newMovies: Movie[] = [];
  constructor(private moviesService: MoviesServiceService) {}

  ngOnInit(): void {
    this.getMovies();
    this.moviesService.getGenres().subscribe((data) => console.log(data));
  }

  slideConfig = {
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          arrows: false,
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,

          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
    ],
  };

  getTrendings() {
    this.moviesService.trendingMovies().subscribe((data: MovieResponse) => {
      // this.trendingMovies = data.results;
      this.trendingMovies = data.results.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
      });
      // console.log(this.trendingMovies);
    });
  }

  async getMovies() {
    const movieResponse = await this.moviesService
      .getMoviesList(1, 'primary_release_date.desc')
      .pipe(take(1))
      .toPromise();
    this.newMovies = movieResponse.results;
    this.getTrendings();
  }
}
