import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getOrders(): Observable<any[]> {
    return this.ordersCollection.valueChanges();
  }

  getOrder(id: string): Observable<any> {
    const orderDocument = this.afs.doc<Order>('orders/' + id);
    return orderDocument.snapshotChanges().pipe(
      map((changes) => {
        const data = changes.payload.data();
        const uid = changes.payload.id;
        return { uid, ...data };
      })
    );
  }

  editOrder(order: Order) {
    return this.ordersCollection.doc(order.id).update(order);
  }
}
