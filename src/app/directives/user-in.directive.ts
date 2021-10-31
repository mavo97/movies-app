import { Directive, OnInit, Input } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../models/user.interface';

@Directive({
  selector: '[appUserIn]',
})
export class UserInDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private auth: AngularFireAuth,
    private viewContainer: ViewContainerRef,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
