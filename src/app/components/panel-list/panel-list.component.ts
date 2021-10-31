import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../providers/orders.service';
import { Order } from '../../models/order.interface';

@Component({
  selector: 'app-panel-list',
  templateUrl: './panel-list.component.html',
  styleUrls: ['./panel-list.component.css'],
})
export class PanelListComponent implements OnInit {
  order: Order;

  constructor(
    private _activatedroute: ActivatedRoute,
    private _ordersService: OrdersService
  ) {
    this._activatedroute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this._ordersService.getOrder(id).subscribe((moviesData) => {
        this.order = moviesData;
        console.log(this.order.movies);
      });
    });
  }

  ngOnInit(): void {}

  return() {
    window.history.back();
  }
}
