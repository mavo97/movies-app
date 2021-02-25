import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-movie-poster',
  templateUrl: './movie-poster.component.html',
  styleUrls: ['./movie-poster.component.css'],
})
export class MoviePosterComponent implements OnInit {
  @Input() vote_average: number;
  @Input() imgSrc: string;
  @Input() release_date: string;
  time: number;
  movieTime: number;
  constructor() {}

  ngOnInit(): void {
    this.time = new Date().getTime() - 7.884e9;
    this.movieTime = new Date(this.release_date).getTime();
    console.log(this.movieTime, this.time);
    console.log(this.time > this.movieTime ? true : false);
  }
}
