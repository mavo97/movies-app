import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../../models/order.interface';
import { Movie } from '../../../models/movie.interface';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdersService } from '../../../providers/orders.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css'],
})
export class EditListComponent implements OnInit {
  @Input() order: Order;
  @Input() options: Movie[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;

  constructor(
    private _snackBar: MatSnackBar,
    private _ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }

  displayFn(movie: Movie): string {
    // console.log(movie);
    return movie && movie.title ? movie.title : '';
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
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
