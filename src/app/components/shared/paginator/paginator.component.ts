import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnInit {
  @Input() index: number = 0;
  @Input() pagesArray: number[] = [];
  @Input() totalPages: number = 0;
  @Output() newIndexValue = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  decrementIndex(index: number) {
    if (this.index > 0) {
      this.newIndexValue.emit(index);
      console.log(index);
    }
  }

  incrementIndex(index: number) {
    if (this.index !== this.totalPages - 1) {
      this.newIndexValue.emit(index);
      console.log(index);
    }
  }

  changeIndexValue(index: number) {
    this.newIndexValue.emit(index);
    console.log(index);
  }
}
