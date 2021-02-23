import { Component, OnInit } from '@angular/core';
import { MoviesServiceService } from '../../providers/movies-service.service';
import { MovieResponse } from '../../models/movie-reponse.interface';
import { Movie } from '../../models/movie.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  slides = [
    { img: 'https://image.tmdb.org/t/p/w185/cDsCLYvJI8kYqJ6tdNhhYYC2DJC.jpg' },
    { img: 'https://image.tmdb.org/t/p/w185/6wjoI3LO0WZHDQdfGlq4de0FHEj.jpg' },
    { img: 'https://image.tmdb.org/t/p/w185/vOefWMYqC1S3aiCTD5MD8HeXl0Y.jpg' },
    { img: 'https://image.tmdb.org/t/p/w185/xSDdRAjxKAGi8fUBLOqSrBhJmF0.jpg' },
    { img: 'https://image.tmdb.org/t/p/w185/zz9Fa9gDEasVXRgHw3rvFb8Rtpa.jpg' },
    { img: 'https://image.tmdb.org/t/p/w185/dcneAm8XdqBvkJWRZ0ht6YQUauF.jpg' },
    { img: 'https://image.tmdb.org/t/p/w185/gI9oVLHXgPYidW2W4A7p1pYW9QB.jpg' },
    { img: 'https://image.tmdb.org/t/p/w185/t5wmHLkHZxoFoAZxhLeP7ewBXe3.jpg' },
  ];
  listMovies: Movie[] = [];

  constructor(private moviesService: MoviesServiceService) {}

  ngOnInit(): void {
    this.getMoviesList();
  }

  getMoviesList() {
    this.moviesService
      .getMoviesList(1, 'primary_release_date.desc')
      .subscribe((data: MovieResponse) => {
        this.listMovies = data.results;
        console.log(this.listMovies);
      });
  }
}
