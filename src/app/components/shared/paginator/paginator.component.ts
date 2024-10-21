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

  constructor(private _router: Router) {}

  ngOnInit(): void {}

  decrementPage(page: number) {
    if (this.page > 0) {
      this.goToPage(page)
    }
  }

  incrementPage(page: number) {
    if (this.page !== this.totalPages) {
      this.goToPage(page)
    }
  }

  changePageValue(page: number) {
    this.goToPage(page)
  }

  goToPage(id: number) {
    // console.log(id, 'PAGE PAGE');
    
    this._router.navigate(['/page', id]);
  }


}
