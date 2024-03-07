import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  @Input() stroke = 'currentColor';
  @Input() width: number | string = '20';
  @Input() height: number | string = '20';
  @Input() styleClass = '';
  @Input() styleCss = '';

  constructor() { }

}
