export interface VideoMovie {
  id: number;
  results: Trailer[];
}
export interface Trailer {
  id: string;
  key: string;
  name: string;
}
