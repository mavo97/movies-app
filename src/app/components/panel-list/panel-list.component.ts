import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../providers/orders.service';
import { Order } from '../../models/order.interface';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Movie } from '../../models/movie.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-panel-list',
  templateUrl: './panel-list.component.html',
  styleUrls: ['./panel-list.component.css'],
})
export class PanelListComponent implements OnInit {
  order: Order;
  myControl = new FormControl();
  options: Movie[] = [];
  filteredOptions: Observable<any[]>;

  constructor(
    private _activatedroute: ActivatedRoute,
    private _ordersService: OrdersService,
    private _snackBar: MatSnackBar
  ) {
    this._activatedroute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this._ordersService.getOrder(id).subscribe((moviesData) => {
        this.order = moviesData;
        // console.log(this.order.movies);
        const movies = JSON.parse(localStorage.getItem('movies'));
        if (movies) {
          this.options = movies;
        }
      });
    });
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
  }

  displayFn(movie: Movie): string {
    // console.log(movie);
    return movie && movie.title ? movie.title : '';
  }

  async editItem(movie: Movie) {
    try {
      const movieToSave = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
      };
      this.order.movies.push(movieToSave);
      await this._ordersService.editOrder(this.order);
      this.openSnackBar('Elemento guardado...', 'Success');
    } catch (error) {
      // console.log(error, 'error');
      this.openSnackBar('No se guardo el elemento...', 'Vuelve a intentar!');
    }
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }
  return() {
    window.history.back();
  }

  async deleteItem(id: number) {
    try {
      this.order.movies = this.order.movies.filter((movie) => movie.id !== id);
      await this._ordersService.editOrder(this.order);
      this.openSnackBar('Lista actualizada...', 'Success');
    } catch (error) {
      // console.log(error, 'error');
      this.openSnackBar('No se guardo la lista...', 'Vuelve a intentar!');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  async completeList(status?: boolean) {
    try {
      this.order.status = status ? status : false;
      await this._ordersService.editOrder(this.order);
      this.openSnackBar('Estado actualizado...', 'Success');
    } catch (error) {
      // console.log(error, 'error');
      this.openSnackBar('No se guardo el status...', 'Vuelve a intentar!');
    }
  }
}
