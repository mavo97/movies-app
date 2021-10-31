import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { User } from '../models/user.interface';
import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private usersCollection: AngularFirestoreCollection<User>;
  user$: Observable<User>;

  constructor(public auth: AngularFireAuth, private afs: AngularFirestore) {
    this.usersCollection = afs.collection<User>('users');
    this.user$ = this.auth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  googleLogin() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  addUser(user: any, uid: string) {
    const userToSave: any = {
      uid: uid,
      email: user.email,
      role: 'basic',
      createdDate: new Date().getTime(),
    };
    return this.usersCollection.doc(uid).set(userToSave);
  }

  logout() {
    this.auth.signOut();
  }

  getUser(id: string): Observable<User> {
    const userDocument = this.afs.doc<User>('users/' + id);
    return userDocument.snapshotChanges().pipe(
      map((changes) => {
        const data = changes.payload.data();
        const uid = changes.payload.id;
        return { uid, ...data };
      })
    );
  }
}
