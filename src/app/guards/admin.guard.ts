import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UrlTree } from '@angular/router';
import { AuthServiceService } from '../providers/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private _authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._authService.user$.pipe(
      take(1),
      map((user) => {
        if (!user) {
          // redirect to some view explaining what happened
          this.router.navigateByUrl('/');
          return false;
        } else if (user.role === 'admin') {
          return true;
        } else {
          this.router.navigateByUrl('/');
          return false;
        }
      })
    );
  }
}
