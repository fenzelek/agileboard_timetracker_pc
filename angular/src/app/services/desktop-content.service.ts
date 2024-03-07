import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

export enum DesktopContentView {
  TASKLIST,
  REGISTERED_TIMES,
}

@Injectable({
  providedIn: 'root'
})
export class DesktopContentService {

  currentView: DesktopContentView = DesktopContentView.TASKLIST;

  private openViewSubject = new Subject<DesktopContentView>();
  onViewOpen$ = this.openViewSubject.asObservable();

  constructor(
    private router: Router,
  ) { }

  open(view: DesktopContentView) {
    this.currentView = view;
    this.router.navigateByUrl('/company/dashboard');
    this.openViewSubject.next(view);
  }

}
