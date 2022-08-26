import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Movie } from '../../../../models/movie.interface';
import { LocalStorageService } from '../../../../providers/local-storage.service';
import { OrdersService } from '../../../../providers/orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialoglistcontent',
  templateUrl: './dialoglistcontent.component.html',
  styleUrls: ['./dialoglistcontent.component.css'],
})
export class DialoglistcontentComponent implements OnInit {
  moviesList: Movie[] = [];
  form: FormGroup;

  constructor(
    private _localStorageService: LocalStorageService,
    private _ordersService: OrdersService,
    private _snackBar: MatSnackBar
  ) {
    this.form = new FormGroup({
      mobile: new FormControl('', [
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^(0|[1-9][0-9]*)$'),
      ]),
    });
  }

  ngOnInit(): void {
    console.log('open');
    this.moviesList = JSON.parse(localStorage.getItem('moviesSelected'));
  }

  deleteItem(id: number) {
    this.moviesList = this.moviesList.filter((movie) => movie.id !== id);
    localStorage.setItem('moviesSelected', JSON.stringify(this.moviesList));
    this._localStorageService.subjectChangeStatus(this.moviesList.length);
  }

  cleanList() {
    this.moviesList = [];
    localStorage.setItem('moviesSelected', JSON.stringify(this.moviesList));
    this._localStorageService.subjectChangeStatus(this.moviesList.length);
  }

  async saveOrder() {
    const order: any = {
      mobile: this.form.value.mobile,
      movies: this.moviesList.map((movie) => {
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
      this.cleanList();
    } catch (error) {
      console.log(error, 'error');
      this.openSnackBar('No se guardo la lista...', 'Vuelve a intentar!');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
