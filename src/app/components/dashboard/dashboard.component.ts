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
    });

    if (window.screen.width <= 700) {
      this.displayedColumns = this.displayedColumns.filter(
        (column) => column !== 'delete'
      );
      this.mobile = true;
    }
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
    return moment(new Date(date)).startOf('minute').fromNow();
  }

  openList(id: string) {
    this._router.navigate(['/panel', id]);
  }

  deleteOrder(id: string) {
    this._ordersService.deleteOrder(id);
  }
}
