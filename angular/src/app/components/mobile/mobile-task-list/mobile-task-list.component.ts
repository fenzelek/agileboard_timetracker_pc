import { ChangeDetectorRef, Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { MobileTaskDetailsDialogComponent } from "../mobile-task-details-dialog/mobile-task-details-dialog.component";
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';
import { MobileTasksFiltersService, SortOption } from '../mobile-tasks-filter/mobile-tasks-filters.service';
import { take, takeUntil, tap } from 'rxjs/operators';
import { TasksFacade } from 'src/core/store/tasks/tasks.facade';
import { TaskEntity } from 'src/core/store/tasks/tasks.model';
import { DesktopTasksComponent } from '../../desktop/desktop-tasks/desktop-tasks.component';
import { LocalStorageService } from 'src/core/local-storage/local-storage.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/core/core.state';
import { NativeService } from 'src/app/services/native.service';
import { Actions, ofType } from '@ngrx/effects';
import { tasksAddS } from 'src/core/store/tasks/tasks.actions';
import { TasksService } from 'src/core/store/tasks/tasks.service';
import { ElectronService } from 'src/electronService/electron.service';
import { AuthFacade } from 'src/core/auth/auth.facade';


@Component({
  selector: 'app-mobile-task-list',
  templateUrl: './mobile-task-list.component.html',
  styleUrls: ['./mobile-task-list.component.scss']
})
export class MobileTaskListComponent extends DesktopTasksComponent {

  @Output() clickSelected: EventEmitter<void> = new EventEmitter<void>();


  constructor(
    protected tasksFacade: TasksFacade,
    protected projectsFacade: ProjectsFacade,
    protected cd: ChangeDetectorRef,
    protected ls: LocalStorageService,
    protected store: Store<AppState>,
    protected nativeService: NativeService,
    private dialog: MatDialog,
    public mobileTasksFiltersService: MobileTasksFiltersService,
    private actions$: Actions,
    protected tasksService: TasksService,
    protected electronService: ElectronService,
    protected authFacade: AuthFacade
  ) {
    super(tasksFacade, projectsFacade, cd, ls, store, nativeService, tasksService, electronService, authFacade);

    this.mobileTasksFiltersService.filtersChange
      .pipe(takeUntil(this.uns$))
      .subscribe(filters => {
        this.filters = filters;
        this.filtersChange.next();
      });

    this.mobileTasksFiltersService.sortChange
      .pipe(takeUntil(this.uns$))
      .subscribe((config) => this.onSortByConfig(config));
  }

  // override
  ngOnInit(): void {
    this.subscribeLoading();
    this.subscribePageSize();
    this.subscribeFilters();

    this.setTasksAutoFetch();
    this.subscribeTasks();
  }

  // override
  protected subscribeTasks() {
    super.subscribeTasks();

    // normal tasks subscription won't yield value on task add, maybe some bug in ngrx
    this.actions$.pipe(
      takeUntil(this.uns$),
      ofType(tasksAddS),

      tap(() => {
        this.tasksFacade.selectedProjectTasks$
          .pipe(
            takeUntil(this.uns$),
            take(1),
          )
          .subscribe(taskList => {
            this.taskList = taskList;
            this.currentTaskList = this.taskList ? this.taskList.slice() : taskList;
            this.updateTaskList();
            this.cd.detectChanges();
          });
      }),
    ).subscribe();
  }

  // override
  protected reset() {
    super.updateTaskList();
    this.mobileTasksFiltersService.tasksChange.next();
  }

  // override
  setSelected(task: TaskEntity) {
    this.tasksFacade.toggleActive(task);
    this.clickSelected.emit();
    this.cd.detectChanges();
  }

  // alternative sort method
  onSortByConfig(config: SortOption) {
    this.sortSettings.column = config.column;
    this.sortSettings.direction = config.direction;

    this.sort();
    this.filter();
    this.updatePageData();
    this.cd.detectChanges();
  }


  openTaskDetails(event: MouseEvent, task: TaskEntity) {
    event.stopPropagation();
    this.dialog.open(MobileTaskDetailsDialogComponent, {
      width: '90vw',
      maxWidth: '90vw',
      data: task
    });
  }

}
