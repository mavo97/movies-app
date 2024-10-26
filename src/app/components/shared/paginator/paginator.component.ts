import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnInit {
  @Input() page: number = 0;
  @Input() pagesArray: number[] = [];
  @Input() totalPages: number = 0;
  @Input() genre: boolean;
  @Input() genreSelected: number;
  mobile: boolean;

  constructor(private _router: Router) {}

  ngOnInit(): void {
    if (window.screen.width <= 800) {
      this.mobile = true;
    }
  }

  decrementPage(page: number) {
    if (this.page > 0) {
      this.goToPage(page);
    }
  }

  incrementPage(page: number) {
    if (this.page !== this.totalPages) {
      this.goToPage(page);
    }
  }

  changePageValue(page: number) {
    this.goToPage(page);
  }

  goToPage(id: number) {
    if (this.genre) {
      this._router.navigate([`/page/${id}`], {
        queryParams: { genre: this.genreSelected },
      });
    }

    if (!this.genre) {
      this._router.navigate(['/page', id]);
    }
  }

  onSelectPageChange(): void {
    this.page = Number(this.page);
    this.changePageValue(this.page);
  }
}
