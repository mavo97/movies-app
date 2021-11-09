import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../../../models/order.interface';
import { Movie } from '../../../models/movie.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  @Input() order: Order | any = {
    id: 'id',
    movies: [],
    createdDate: new Date().getTime(),
    status: true,
  };
  @Input() options: Movie[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  @Input() edit: boolean = false;
  form: FormGroup;
  screenHeight: number;
  customStyle: string;

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
    if (!this.edit) {
      const movies = JSON.parse(localStorage.getItem('movies'));
      this.options = movies;

      this.form = new FormGroup({
        mobile: new FormControl('', [
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^(0|[1-9][0-9]*)$'),
        ]),
      });
    }
    this.screenHeight = window.screen.height;
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
    if (this.edit) {
      try {
        const movieToSave = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          release_date: movie.release_date,
        };
        const find = this.order.movies.find((mov) => mov.id === movie.id);
        if (!find) {
          this.order.movies.push(movieToSave);
        }
        await this._ordersService.editOrder(this.order);
        this.openSnackBar('Elemento guardado...', 'Success');
      } catch (error) {
        // console.log(error, 'error');
        this.order.movies = this.order.movies.filter(
          (mov) => mov.id !== movie.id
        );
        this.openSnackBar('No se guardo el elemento...', 'Vuelve a intentar!');
      }
    }

    if (!this.edit) {
      const movieToSave = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
      };
      const find = this.order.movies.find((mov) => mov.id === movie.id);
      if (!find) {
        this.order.movies.push(movieToSave);
      }
      this.myControl.reset('');
    }
  }

  async deleteItem(id: number) {
    if (this.edit) {
      try {
        this.order.movies = this.order.movies.filter(
          (movie) => movie.id !== id
        );
        await this._ordersService.editOrder(this.order);
        this.openSnackBar('Lista actualizada...', 'Success');
      } catch (error) {
        // console.log(error, 'error');
        this.openSnackBar('No se guardo la lista...', 'Vuelve a intentar!');
      }
    }

    if (!this.edit) {
      this.order.movies = this.order.movies.filter((movie) => movie.id !== id);
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

  async saveOrder() {
    const order: any = {
      mobile: this.form.value.mobile,
      movies: this.order.movies.map((movie) => {
        return {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          release_date: movie.release_date,
        };
      }),
      status: true,
      createdDate: new Date().getTime(),
    };

    try {
      await this._ordersService.addOrder(order);
      this.openSnackBar('Lista envíada...', 'Success');
      this.order = {
        id: 'id',
        movies: [],
        createdDate: new Date().getTime(),
        status: true,
      };
      this.form.reset();
    } catch (error) {
      console.log(error, 'error');
      this.openSnackBar('No se guardo la lista...', 'Vuelve a intentar!');
    }
  }
}
