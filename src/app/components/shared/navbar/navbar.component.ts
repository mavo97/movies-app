import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../providers/auth-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    public _authService: AuthServiceService
  ) {}

  ngOnInit(): void {}

  searchMovie(movie: string) {
    if (movie.length > 0) {
      this.router.navigate(['buscar/', movie]);
    } else {
      this.router.navigate(['home']);
    }
  }

  async login() {
    const userResponse = await this._authService.googleLogin();
    this._authService.getUser(userResponse.user.uid).subscribe((user) => {
      if (!user.email) {
        this._authService.addUser(userResponse.user, userResponse.user.uid);
      }
    });
  }

  async loginFacebook() {
    const userResponse = await this._authService.facebookLogin();
    this._authService.getUser(userResponse.user.uid).subscribe((user) => {
      if (!user.email) {
        this._authService.addUser(userResponse.user, userResponse.user.uid);
      }
    });
  }

  logout() {
    this._authService.logout();
  }

  dataCompleted(): boolean {
    const finished: string = localStorage.getItem('finished');
    if (finished === 'true') {
      return true;
    }
    return false;
  }
}
