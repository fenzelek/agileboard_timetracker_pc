import { Component, Input, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NativeService } from 'src/app/services/native.service';
import { AppState } from 'src/core/core.state';
import { actionSettingsChangeTaskDetailsPosition } from 'src/core/settings/settings.actions';
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';
import { ProjectStatus, Sprint } from 'src/core/store/projects/projects.model';
import { TasksFacade } from 'src/core/store/tasks/tasks.facade';
import { Task, TaskEntity } from 'src/core/store/tasks/tasks.model';
import { TasksService } from 'src/core/store/tasks/tasks.service';
import { Time } from 'src/core/timeStore/model';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { ElectronService, ViewMode } from 'src/electronService/electron.service';

const nativeService = new NativeService();


@Component({
  selector: 'app-desktop-task-details',
  templateUrl: './desktop-task-details.component.html',
  styleUrls: ['./desktop-task-details.component.scss']
})
export class DesktopTaskDetailsComponent implements OnInit, OnDestroy {
  protected uns$ = new Subject<void>();

  @Input() taskDetailsPosition: 'right' | 'bottom';

  private taskChanged$ = new Subject<void>();

  task: TaskEntity;
  time: Time;

  loading: boolean;

  safeUrls: SafeUrl[] = [];
  description: string;

  descriptionHandlerComponent = {
    handleLink: (url: string) => {
      nativeService.openUrl(url);
    }
  }

  sprints: Sprint[] = [];
  statuses: ProjectStatus[] = [];

  constructor(
    protected store: Store<AppState>,
    protected projectsFacade: ProjectsFacade,
    protected tasksFacade: TasksFacade,
    protected tasksService: TasksService,
    protected timeStore: TimeStore,
    protected sanitizer: DomSanitizer,
    protected electronService: ElectronService,
  ) { }

  ngOnInit(): void {
    this.subscribeSelectedTask();
    this.subscribeSprints();
    this.subscribeStatuses();
    this.subscribeDetailsLoading();
  }

  toggleTaskDetailsPosition() {
    const nextPosition = this.getNextPosition();
    this.store.dispatch(actionSettingsChangeTaskDetailsPosition({ position: nextPosition }));
  }

  getNextPosition(): 'bottom' | 'right' {
    if (this.taskDetailsPosition === 'bottom') {
      return 'right';
    } else  {
      return 'bottom';
    }
  }

  private subscribeSelectedTask() {
    this.tasksFacade.selectedTask$
      .pipe(takeUntil(this.uns$))
      .subscribe(task => {
        this.task = task;

        if (task) {
          this.fetchTaskDetails();
          this.subscribeTime();
        }

        if (this.task && this.task.details) {
          this.handleDescription();
        }
      });
  }

  private subscribeSprints() {
    this.projectsFacade.sprints$.pipe(takeUntil(this.uns$)).subscribe((sprints) => {
      this.sprints = sprints;
    });
  }

  private subscribeStatuses() {
    this.tasksFacade.selectedProjectStatuses$.pipe(takeUntil(this.uns$)).subscribe((statuses) => {
      this.statuses = statuses;
    });
  }

  protected subscribeDetailsLoading() {
    this.tasksFacade.loadingDetails$.pipe(takeUntil(this.uns$)).subscribe(loading => {
      this.loading = loading;

      if (this.task?.details && !loading) {
        this.handleDescription();
      }
    });
  }
 
  protected subscribeTime() {
    this.taskChanged$.next();
    this.taskChanged$.complete();
    this.taskChanged$ = new Subject<void>();

    this.timeStore.tasks.onChange(this.task.timeStoreKey)
      .pipe(takeUntil(this.uns$), takeUntil(this.taskChanged$))
      .subscribe(time => this.time = time);
  }

  protected fetchTaskDetails() {
    if (!this.task.details) {
      this.tasksFacade.fetchDetails(this.task);
    }
  }

  protected handleDescription() {
    let html = this.task.details.description;
    html = this.sanitizer.sanitize(SecurityContext.HTML, html);

    const hrefReg = /href="([a-zA-Z0-9?=&/\\;:.,\-@_%#!$^*\(\)\{\}|<>+`~]+)"/g;
    const clickHandler = `(click)="handleLink('$1')"`;

    html = html.replace(hrefReg, clickHandler);

    this.description = html;
  }

  close() {
    this.tasksFacade.toggleSelected(this.task);
  }

  getSprintName() {
    const foundSprint = this.tasksService.findSprintById(this.sprints, this.task.data.sprint_id);
    return foundSprint ? foundSprint.name : '-';
  }

  getStatusName(task: Task) {
    const foundStatus = this.tasksService.findStatusById(this.statuses, task.status_id);
    return foundStatus ? foundStatus.name : '-';
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
    this.taskChanged$.next();
    this.taskChanged$.complete();
  }

}
