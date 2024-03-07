import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Subject} from "rxjs";


@Component({
  selector: 'app-mobile-projects',
  templateUrl: './mobile-projects.component.html',
  styleUrls: ['./mobile-projects.component.scss']
})
export class MobileProjectsComponent implements OnInit {

  private uns$ = new Subject<void>();
  @Output() goNextStep: EventEmitter<void> = new EventEmitter<void>();


  constructor() { 

  }

  ngOnInit(): void { 
    console.log('MobileProjectsComponent')
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }

}
