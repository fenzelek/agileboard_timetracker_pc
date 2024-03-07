import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DesktopContentService, DesktopContentView } from 'src/app/services/desktop-content.service';
import { AppState } from 'src/core/core.state';
import { selectTaskDetailsPosition } from 'src/core/settings/settings.selectors';
import { TasksFacade } from 'src/core/store/tasks/tasks.facade';
import { ElectronService, ViewMode } from 'src/electronService/electron.service';


@Component({
  selector: 'app-desktop-content',
  templateUrl: './desktop-content.component.html',
  styleUrls: ['./desktop-content.component.scss']
})
export class DesktopContentComponent implements OnInit, OnDestroy {
  private uns$ = new Subject<void>();

  DesktopContentView = DesktopContentView;
  activeView: DesktopContentView = DesktopContentView.TASKLIST;
  isTaskSelected: boolean;
  taskDetailsPosition: 'right' | 'bottom';

  constructor(
    private desktopContentService: DesktopContentService,
    private tasksFacade: TasksFacade,
    private store: Store<AppState>,
    private electronService: ElectronService,
  ) { }

  ngOnInit(): void {
    this.activeView = this.desktopContentService.currentView;
    this.subscribeTaskDetailsPosition();
    this.subscribeViewChange();
    this.subscribeSelectedTask();
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }

  private subscribeTaskDetailsPosition() {
    this.store.select(selectTaskDetailsPosition).pipe(takeUntil(this.uns$)).subscribe((position) => {
      this.taskDetailsPosition = position || 'bottom';

      if (position === 'bottom') {
        this.electronService.changeViewMode(ViewMode.MEDIUM);
      } else if (this.isTaskSelected) {
        this.electronService.changeViewMode(ViewMode.WIDE);
      }
    });
  }

  private subscribeSelectedTask() {
    this.tasksFacade.selectedTask$.pipe(takeUntil(this.uns$)).subscribe(task => {
      this.isTaskSelected = !!task;

      if (this.isTaskSelected) {
        if (this.taskDetailsPosition === 'bottom') {
          this.electronService.changeViewMode(ViewMode.MEDIUM);
        } else {
          this.electronService.changeViewMode(ViewMode.WIDE);
        }
      } else {
        this.electronService.changeViewMode(ViewMode.MEDIUM);
      }
    });
  }

  private subscribeViewChange(): void {
    this.desktopContentService.onViewOpen$.pipe(takeUntil(this.uns$)).subscribe(view => {
      this.activeView = view;
    });
  }

}
