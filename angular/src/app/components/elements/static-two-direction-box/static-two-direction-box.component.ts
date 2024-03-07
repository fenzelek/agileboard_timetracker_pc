import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-static-two-direction-box',
  templateUrl: './static-two-direction-box.component.html',
  styleUrls: ['./static-two-direction-box.component.scss']
})
export class StaticTwoDirectionBoxComponent implements OnInit {

  @Input() leftText: string = "";
  @Input() rightText: string = "";
  @Input() direction: 'coll' | 'row' = 'row';

  constructor() { }

  ngOnInit(): void {
  }

}
