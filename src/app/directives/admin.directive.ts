import { Directive, OnInit, Input } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { AuthServiceService } from '../providers/auth-service.service';

@Directive({
  selector: '[appAdmin]',
})
export class AdminDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private auth: AngularFireAuth,
    private viewContainer: ViewContainerRef,
    private _usersService: AuthServiceService
  ) {}

  ngOnInit() {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this._usersService
          .getUser(user.uid)
          .pipe(take(1))
          .subscribe((currentUser) => {
            if (
              currentUser.role === 'admin' ||
              currentUser.role === 'creator'
            ) {
              this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
              this.viewContainer.clear();
            }
          });
      }
    });
  }
}
