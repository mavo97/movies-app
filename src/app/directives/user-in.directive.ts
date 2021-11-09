import { Directive, OnInit, Input } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { AuthServiceService } from '../providers/auth-service.service';

@Directive({
  selector: '[appUserIn]',
})
export class UserInDirective implements OnInit {
  @Input() appUserIn: boolean = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private auth: AngularFireAuth,
    private viewContainer: ViewContainerRef,
    private db: AngularFirestore,
    private _usersService: AuthServiceService
  ) {}

  ngOnInit() {
    this.auth.authState.subscribe((user) => {
      if (this.appUserIn && user) {
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
      if (!user) {
        this.viewContainer.clear();
      }
      if (user && !this.appUserIn) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
