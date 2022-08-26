import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from '../../providers/orders.service';
import { Order } from '../../models/order.interface';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'mobile',
    'movies',
    'status',
    'createdDate',
    'delete',
  ];
  dataSource: MatTableDataSource<Order>;

  orders: Order[] = [];
  mobile: boolean = false;
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();
  firstDay: number = new Date(
    this.currentYear,
    this.currentMonth - 1,
    1
  ).getTime();
  lastDay: number = new Date(this.currentYear, this.currentMonth, 0).getTime();
  items: number = 0;

  constructor(private _ordersService: OrdersService, private _router: Router) {}

  ngOnInit(): void {
    this._ordersService.getOrders().subscribe((data) => {
      console.log(data);
      this.orders = data;
      this.orders = this.orders.sort((a, b) => {
        return b.createdDate - a.createdDate;
      });
      this.dataSource = new MatTableDataSource(this.orders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.reducer(this.orders);
    });

    if (window.screen.width <= 700) {
      this.displayedColumns = this.displayedColumns.filter(
        (column) => column !== 'delete'
      );
      this.mobile = true;
    }

    let movies: any[] = JSON.parse(localStorage.getItem('movies'));
    movies = movies.map((m) => {
      return { id: m.id, title: m.title };
    });
    movies = movies.map((m) => {
      const moviesSelections = this.orders.filter((o) => {
        const findSelection = o.movies.find((s) => s.id === m.id);
        if (findSelection) {
          return findSelection;
        }
      });
      return { selections: moviesSelections.length, ...m };
    });
    movies = movies.filter((m) => m.selections > 0);
    movies = movies.sort((a, b) => {
      return b.selections - a.selections;
    });
    console.log(movies, 'movies');

    const movies2: any[] = JSON.parse(localStorage.getItem('movies'));
    const moviesNotSelected = movies2.filter((m2) => {
      const find = movies.find((mf) => mf.id === m2.id);
      if (!find) {
        return m2;
      }
    });
    const moviesNotSelected2 = moviesNotSelected.map((m) => {
      return { id: m.id, title: m.title, vote_average: m.vote_average };
    });
    console.log(
      moviesNotSelected2.sort(function (a, b) {
        return parseFloat(b.vote_average) - parseFloat(a.vote_average);
      })
    );
  }

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  formatDate(date: number): string {
    moment.locale('es');
    const now = new Date().getTime();
    const result = now - date;
    if (result >= 6.048e8) {
      return moment(new Date(date)).format('ll');
    } else {
      return moment(new Date(date)).startOf('minute').fromNow();
    }
  }

  formatDate2(date: number): string {
    moment.locale('es');
    return moment(new Date(date)).format('ll');
  }

  openList(id: string) {
    this._router.navigate(['/panel', id]);
  }

  deleteOrder(id: string) {
    this._ordersService.deleteOrder(id);
  }

  reducer(orders: Order[]) {
    orders = orders.filter((order) => {
      if (
        order.createdDate >= this.firstDay &&
        order.createdDate <= this.lastDay
      ) {
        return order;
      }
    });
    const reducer = (previousValue, currentValue) =>
      previousValue + currentValue.movies.length;
    this.items = orders.reduce(reducer, 0);
  }
}
