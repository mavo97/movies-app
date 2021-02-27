import { Genre } from './genre.interface';
export interface Movie {
  poster_path?: string;
  overview: string;
  release_date: string;
  genres: Genre[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path?: string;
  vote_average: number;
  video: boolean;
  homepage: string;
  tagline: string;
}
