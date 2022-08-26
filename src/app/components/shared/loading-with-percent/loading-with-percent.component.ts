import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-with-percent',
  templateUrl: './loading-with-percent.component.html',
  styleUrls: ['./loading-with-percent.component.css'],
})
export class LoadingWithPercentComponent implements OnInit {
  @Input() listMovies: any[] = [];
  @Input() total_results: number = 0;
  constructor() {}

  ngOnInit(): void {}

  getPercent(): number {
    const totalPages: number = this.total_results;
    const movies: number = this.listMovies.length;
    console.log(totalPages);
    return (movies * 100) / totalPages;
  }
}
