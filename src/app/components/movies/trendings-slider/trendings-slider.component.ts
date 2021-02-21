import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trendings-slider',
  templateUrl: './trendings-slider.component.html',
  styleUrls: ['./trendings-slider.component.css'],
})
export class TrendingsSliderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
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
}
