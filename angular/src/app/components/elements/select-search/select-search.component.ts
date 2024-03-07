import { ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';


@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss']
})
export class SelectSearchComponent implements OnInit {
  private querySubs: Subscription;
  private lastQuery: string;

  queryChange = new Subject<string>();

  @Input() throttleTime = 250;
  @Input() placeholder = 'Search';
  @Output() search = new EventEmitter<string>();

  @ViewChild('inp') input: ElementRef<HTMLInputElement>;

  constructor(
  ) { }

  ngOnInit(): void {
    this.querySubs = this.queryChange.pipe(
      debounceTime(this.throttleTime),
      filter(val => val !== this.lastQuery),
    ).subscribe((val) => {
      this.lastQuery = val;
      this.search.emit(val);
    });
  }

  focus() {
    this.input.nativeElement.focus();
  }

  clear() {
    this.input.nativeElement.value = '';
    this.queryChange.next('');
    this.focus();
  }

  ngOnDestroy() {
    this.querySubs.unsubscribe();
  }

}
