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

  displayedColumns: string[] = ['mobile', 'movies', 'status', 'createdDate'];
  dataSource: MatTableDataSource<Order>;

  orders: Order[] = [];

  constructor(private _ordersService: OrdersService, private _router: Router) {}

  ngOnInit(): void {
    this._ordersService.getOrders().subscribe((data) => {
      console.log(data);
      this.orders = data;
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(this.orders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
    return moment(new Date(date)).startOf('hour').fromNow();
  }

  openList(id: string) {
    this._router.navigate(['/panel', id]);
  }
}
