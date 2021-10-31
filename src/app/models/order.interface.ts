import { MovieSelected } from './movies-selected.interface';

export interface Order {
  id: string;
  mobile: number;
  movies: MovieSelected[];
  createdDate: number;
}
