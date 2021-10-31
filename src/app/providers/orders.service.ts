import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Order } from '../models/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private ordersCollection: AngularFirestoreCollection<Order>;

  constructor(private afs: AngularFirestore) {
    this.ordersCollection = afs.collection<Order>('orders');
  }

  async addOrder(order: any): Promise<void> {
    const id = this.afs.createId();

    const orderToSave: Order = {
      id: id,
      ...order,
    };
    this.ordersCollection.doc(id).set(orderToSave);
  }
}
