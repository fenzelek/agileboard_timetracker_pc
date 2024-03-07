import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-no-internet-connection',
  templateUrl: './no-internet-connection.component.html',
  styleUrls: ['./no-internet-connection.component.scss']
})
export class NoInternetConnectionComponent implements OnInit {

  @Output() retry = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
