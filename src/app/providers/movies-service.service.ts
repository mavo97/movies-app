import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovieResponse } from '../models/movie-reponse.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesServiceService {
  private apiKey = '004b0aad2f76bf744cbeb193c643a98d';
  private token =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDRiMGFhZDJmNzZiZjc0NGNiZWIxOTNjNjQzYTk4ZCIsInN1YiI6IjVmM2MxM2RhOGRiYzMzMDAzNmE2NGI2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ToXgB8R80gLV3-v6an3DiPjlOCE8ydsQXKo8r-26MQw';
  private listId = 7055352;
  private language = 'es-MX';
  private url = 'https://api.themoviedb.org/4';
  private url2 = 'https://api.themoviedb.org/3';
  constructor(private http: HttpClient) {}

  trendingMovies(): Observable<MovieResponse> {
    const mediaType = 'movie';
    const timeWindow = 'week';
    return this.http.get<MovieResponse>(
      `${this.url2}/trending/${mediaType}/${timeWindow}?api_key=${this.apiKey}&language=${this.language}`
    );
  }

  getMoviesList(page: number, order: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.url}/list/${this.listId}?page=${page}&api_key=${this.apiKey}&language=es-MX&sort_by=${order}`
    );
  }

  getGenres() {
    return this.http.get<any>(
      `${this.url2}/genre/movie/list?api_key=${this.apiKey}&language=es-MX`
    );
  }
}
