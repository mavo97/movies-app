import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageSrc',
})
export class ImageSrcPipe implements PipeTransform {
  transform(pelicula: any): any {
    const img_base_url = 'https://image.tmdb.org/t/p/w342/';

    // if (backdrop) {
    //   return img_base_url + pelicula.backdrop_path;
    // }

    if (pelicula) {
      if (pelicula.poster_path) {
        return img_base_url + pelicula.poster_path;
      } else {
        if (pelicula.backdrop_path) {
          return img_base_url + pelicula.backdrop_path;
        } else {
          return 'assets/no-image.png';
        }
      }
    }
  }
}
