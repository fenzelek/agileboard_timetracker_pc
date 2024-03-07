import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, delay, filter, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { NativeService } from 'src/app/services/native.service';
import { AuthFacade } from 'src/core/auth/auth.facade';
import { AppState } from 'src/core/core.state';
import { LocalStorageService } from 'src/core/local-storage/local-storage.service';
import { actionSettingsChangeTaskListPageSize } from 'src/core/settings/settings.actions';
import { selectTaskListPageSize } from 'src/core/settings/settings.selectors';
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';
import { ProjectStatus, Sprint, User } from 'src/core/store/projects/projects.model';
import { TasksFacade } from 'src/core/store/tasks/tasks.facade';
import { Task, TaskEntity } from 'src/core/store/tasks/tasks.model';
import { TasksService } from 'src/core/store/tasks/tasks.service';
import { ElectronService } from 'src/electronService/electron.service';
import { environment } from 'src/environments/environment';
import TasksFiltersManager from '../../abstract/tasksFiltersManager';
import { SelectSearchComponent } from '../../elements/select-search/select-search.component';


export type SortDirection = 'asc' | 'desc';

export class Sort {
  direction: SortDirection = 'asc';
  column: keyof Task = 'title_number';
}

export class FilterFields {
  name: string;
  status: number;
  sprint: number;
  assigned: number;
}
export class Filters extends FilterFields {
  name: string = null;
  status: number = null;
  sprint: number = null;
  assigned: number = null;
  get empty() {
    return !this.name && !this.status && !this.sprint && !this.assigned;
  }
}


@Component({
  selector: 'app-desktop-tasks',
  templateUrl: './desktop-tasks.component.html',
  styleUrls: ['./desktop-tasks.component.scss']
})
export class DesktopTasksComponent extends TasksFiltersManager implements OnInit {
  protected uns$ = new Subject<void>();

  loading = false;
  displayedColumns: string[] = ['title', 'name', 'status', 'sprint', 'assigned', 'buttons'];
  lastProjectId: number = null;

  projectHasChanged: boolean;
  isSelectedTask$ = this.tasksFacade.selectedTask$;
  autoAssignMe$ = this.tasksFacade.autoAssignMe$;

  taskList: TaskEntity[];                   // fetched from api
  protected sortedTaskList: TaskEntity[];   // sorted
  protected currentTaskList: TaskEntity[];  // sorted and filtred

  // sprints
  allSprints: Sprint[];
  sprints: Sprint[];

  // statuses
  allStatuses: ProjectStatus[];
  statuses: ProjectStatus[];

  // users
  users: User[];
  allUsers: User[];

  // pagination data
  pageData: TaskEntity[];
  pageIndex = 0;
  pageSize = 5;
  allDataLength = 0;
  protected startIndex = 0;
  protected endIndex = this.pageSize;

  // sort
  sortSettings = new Sort();

  // filters
  filters = new Filters();
  filtersChange = new Subject<void>();
  autoAssignMe = false;

  @ViewChild('sprintFilterSearch') sprintFilterSearch: SelectSearchComponent;
  @ViewChild('statusFilterSearch') statusFilterSearch: SelectSearchComponent;
  @ViewChild('assignedFilterSearch') assignedFilterSearch: SelectSearchComponent;


  constructor(
    protected tasksFacade: TasksFacade,
    protected projectsFacade: ProjectsFacade,
    protected cd: ChangeDetectorRef,
    protected ls: LocalStorageService,
    protected store: Store<AppState>,
    protected nativeService: NativeService,
    protected tasksService: TasksService,
    protected electronService: ElectronService,
    protected authFacade: AuthFacade
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribeLoading();
    this.subscribePageSize();
    this.subscribeFilters();
    this.subscribeProjectChanged();

    this.setSprintsAutoFetch();
    this.subscribeStatuses();
    this.subscribeSprints();

    this.setUsersAutoFetch();
    this.subscribeUsers();

    this.setTasksAutoFetch();
    this.subscribeTasks();
  }

  protected subscribePageSize() {
    this.store.select(selectTaskListPageSize)
      .pipe(takeUntil(this.uns$))
      .subscribe(size => {
        if (size) {
          this.pageSize = size;
          this.endIndex = size;
        }
      });
  }

  protected subscribeLoading() {
    this.tasksFacade.loadingTasks$
      .pipe(takeUntil(this.uns$))
      .subscribe(loading => {
        this.loading = loading;
        this.cd.detectChanges();
      });
  }

  protected subscribeProjectChanged() {
    this.tasksFacade.loadingTasks$
      .pipe(
        takeUntil(this.uns$),
        filter(v => v),
        withLatestFrom(this.projectsFacade.selectedProjectId$)
      )
      .subscribe(([loading, projectId]) => {
        this.projectHasChanged = this.lastProjectId !== projectId;
      });

    this.projectsFacade.selectedProjectId$
      .pipe(
        takeUntil(this.uns$),
        delay(1), // important !!!
      )
      .subscribe(projectId => {
        this.lastProjectId = projectId;
      });
  }

  protected setSprintsAutoFetch() {
    this.projectsFacade.sprintsEmpty$
      .pipe(takeUntil(this.uns$), filter(isEmpty => isEmpty))
      .subscribe(() => this.projectsFacade.fetchSprints());
  }

  protected subscribeSprints() {
    this.projectsFacade.sprints$
      .pipe(takeUntil(this.uns$))
      .subscribe(sprints => {
        this.allSprints = sprints;
        this.sprints = sprints ? sprints.slice() : sprints;
      });
  }

  protected subscribeStatuses() {
    this.tasksFacade.selectedProjectStatuses$
      .pipe(takeUntil(this.uns$))
      .subscribe(statuses => {
        this.allStatuses = statuses;
        this.statuses = statuses ? statuses.slice() : statuses;
      });
  }

  protected setUsersAutoFetch() {
    this.projectsFacade.usersEmpty$
      .pipe(takeUntil(this.uns$), filter(isEmpty => isEmpty))
      .subscribe(() => this.projectsFacade.fetchUsers());
  }

  protected subscribeUsers() {
    this.projectsFacade.users$
      .pipe(takeUntil(this.uns$))
      .subscribe(users => {
        this.allUsers = users;
        this.users = users ? users.slice() : users;

        if(this.autoAssignMe) {
          this.filters.assigned = this.authFacade.user.id;
          this.filtersChange.next();
        }
      });
  }

  /**
   * @description Fetch tasks if empty
   */
  protected setTasksAutoFetch() {
    this.tasksFacade.projectTasksEmpty$
      .pipe(takeUntil(this.uns$), filter(isEmpty => isEmpty))
      .subscribe(() => this.tasksFacade.fetchTasks());
  }

  protected subscribeTasks() {
    this.tasksFacade.selectedProjectTasks$
      .pipe(takeUntil(this.uns$))
      .subscribe(taskList => {
        this.taskList = taskList;
        this.currentTaskList = this.taskList ? this.taskList.slice() : taskList;
        this.updateTaskList();
        this.cd.detectChanges();
      });
  }

  protected subscribeFilters() {
    this.filtersChange.pipe(
      takeUntil(this.uns$),
      debounceTime(250),
      tap(() => {
        console.log('filters ', this.filters);
      })
    ).subscribe(() => this.onFilter());

    
    this.projectsFacade.selectedProjectId$.pipe(
      takeUntil(this.uns$),
      withLatestFrom(this.autoAssignMe$)
      ).subscribe(([_, value]) => {
      this.autoAssignMe = value;
      this.filters.assigned = value ? this.authFacade.user.id : null;
      this.filtersChange.next();
      this.cd.detectChanges();
    })
  }

  setAutoAssignMe(value: boolean) {
    this.tasksFacade.setAutoAssignMe(value);
    this.filters.assigned = value ? this.authFacade.user.id : null;
    this.filtersChange.next();
  }

  protected updateTaskList() {
    const projectId = this.getProjectId();
    const projectChanged = this.lastProjectId !== projectId;
    
    if (projectChanged || !this.taskList) {
      this.resetPagination();
      this.resetFilters();
      this.resetSort();
      this.applyDefaultSort();
    } else {
      this.sort();
      this.filter();
      this.updatePagination();
    }
  }

  protected applyDefaultSort() {
    if (this.taskList) {
      this.sort();
      this.filter();
      this.updatePageData();
    }
  }

  protected getProjectId() {
    return this.taskList && this.taskList.length ? this.taskList[0].data.project_id : null;
  }

  getStatusName(task: Task) {
    const foundStatus = this.tasksService.findStatusById(this.allStatuses, task.status_id);
    return foundStatus ? foundStatus.name : '-';
  }

  getSprintName(task: Task) {
    const foundSprint = this.tasksService.findSprintById(this.sprints, task.sprint_id);
    return foundSprint ? foundSprint.name : '-';
  }

  protected updatePagination() {
    this.allDataLength = this.currentTaskList.length;
    const lastPageIndex = (Math.ceil(this.allDataLength / this.pageSize)) -1;

    if (this.pageIndex > lastPageIndex) {
      this.pageIndex = lastPageIndex;
    }

    this.startIndex = this.pageIndex * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;

    this.updatePageData();
  }

  protected resetPagination() {
    if (!this.taskList) return; // initially undefined

    // change page to first
    this.pageIndex = 0;
    this.startIndex = 0;
    this.endIndex = this.pageSize;
    
    this.allDataLength = this.taskList.length;
    this.updatePageData();
  }
  
  protected resetFilters() {
    this.filters.name = null;
    this.filters.status = null;
    this.filters.sprint = null;
  }

  protected resetSort() {
    if (!this.taskList) return;
    this.sortedTaskList = this.taskList.slice();
    this.sortSettings = new Sort();
  }

  protected updatePageData() {
    this.pageData = this.currentTaskList ? this.currentTaskList.slice(this.startIndex, this.endIndex) : null;
  }

  /**
   * @description Sorts by column and direction if set, restore default order otherwise
   */
  protected sort() {
    if (this.sortSettings.direction) {
      const column = this.sortSettings.column;
      const direction = this.sortSettings.direction === 'asc' ? 1 : -1;

      this.sortedTaskList = this.taskList.slice().sort((a, b) => {
        const isBigger = a.data[column] < b.data[column] ? 1 : -1;
        return direction * isBigger;
      });
    } else {
      this.sortedTaskList = this.taskList.slice();
    }
  }

  protected onFilter() {
    this.filter();
    this.updatePageData();
    this.updatePaginationAfterFilters();
    this.cd.detectChanges();
  }

  protected filter() {
    // if all filters empty, just set copy of sorted task list
    if (this.filters.empty) {
      this.currentTaskList = this.sortedTaskList ? this.sortedTaskList.slice() : null;
      return;
    }

    const nameFilter = this.filters.name ? this.filters.name.toLowerCase().trim() : null;


    // the following check functions return true if filter empty

    const checkName = this.filters.name ? (task: TaskEntity) =>
      task.data.title.toLowerCase().includes(nameFilter) ||
      task.data.name.toLowerCase().includes(nameFilter)
    : () => true;

    const checkStatus = this.filters.status ? (task: TaskEntity) =>
      task.data.status_id === this.filters.status
    : () => true;

    const checkSprint = this.filters.sprint ? (task: TaskEntity) =>
      task.data.sprint_id === this.filters.sprint
    : () => true;

    const checkAssigned = 
      this.filters.assigned === -1 ?  // -1 = unassigned
        (task: TaskEntity) => !task.data.assigned_user.data :
      this.filters.assigned ?
        (task: TaskEntity) => task.data.assigned_user.data && task.data.assigned_user.data.id === this.filters.assigned :
        () => true;


    this.currentTaskList = this.sortedTaskList.filter(task => 
      checkName(task) && checkStatus(task) && checkSprint(task) && checkAssigned(task)
    );
  }

  protected updatePaginationAfterFilters() {
    this.allDataLength = this.currentTaskList ? this.currentTaskList.length : null;
    this.changePage({
      pageIndex: 0,
      length: this.allDataLength,
      pageSize: this.pageSize,
    });
  }

  protected dispatchPageSizeChange() {
    this.store.dispatch(actionSettingsChangeTaskListPageSize({ taskListPageSize: this.pageSize }));
  }

  changePage(ev: PageEvent) {
    this.pageSize = ev.pageSize;
    this.pageIndex = ev.pageIndex;
    this.startIndex = ev.pageIndex * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
    this.updatePageData();
    this.dispatchPageSizeChange();
  }

  onSort(column: string) {
    const columnHasChanged = this.sortSettings.column !== column;

    // null -> asc -> desc
    let direction: SortDirection;

    if (columnHasChanged || !this.sortSettings.direction)
      direction = 'asc';
    else if (this.sortSettings.direction === 'asc')
      direction = 'desc';
    else
      direction = null;

    this.sortSettings.column = direction ? (column as keyof Task) : null;
    this.sortSettings.direction = direction;

    this.sort();
    this.filter();
    this.updatePageData();
  }

  clearStatus() {
    this.filters.status = null;
    this.filtersChange.next();
  }

  clearSprint() {
    this.filters.sprint = null;
    this.filtersChange.next();
  }

  clearAssigned() {
    this.filters.assigned = null;
    this.filtersChange.next();
  }

  focusStatusFilterSearch() {
    this.statusFilterSearch.focus();
  }

  focusSprintFilterSearch() {
    this.sprintFilterSearch.focus();
  }

  focusAssignedFilterSearch() {
    this.assignedFilterSearch.focus();
  }

  /**
   * @description Open task in browser (agileBoard)
   */
  openTaskInBrowser(task: TaskEntity, ev: Event) {
    ev.stopPropagation();
    const url = `${environment.abUrl}/projects/${task.data.project_id}/ticket/${task.data.title}`;
    this.nativeService.openUrl(url);
  }

  toggleActive(task: TaskEntity, ev: Event) {
    ev.stopPropagation();
    this.tasksFacade.toggleActive(task);
  }
  
  toggleSelected(task: TaskEntity) {
    this.tasksFacade.toggleSelected(task);
  }

  taskListWrapperScrollTop() {
    const wrapper = document.querySelector('.task-list-wrapper');
    wrapper.scrollTo({ behavior: 'smooth', top: 0 });
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }

}
