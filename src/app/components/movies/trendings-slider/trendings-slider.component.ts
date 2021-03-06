import { Component, OnInit, Input } from '@angular/core';
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
  @Input() tMovies: Movie[] = [];
  trendingMovies: Movie[] = [];
  newMovies: Movie[] = [];
  loading: boolean;
  constructor(private moviesService: MoviesServiceService) {}

  ngOnInit(): void {
    // this.getMovies();
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
      this.loading = false;
      // console.log(this.trendingMovies);
    });
  }

  // async getMovies() {
  //   this.loading = true;
  //   const movies: Movie[] = JSON.parse(localStorage.getItem('movies'));

  //   this.newMovies = movies;
  //   this.getTrendings();
  // }
}
