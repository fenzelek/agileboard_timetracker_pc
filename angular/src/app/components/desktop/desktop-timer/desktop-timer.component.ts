import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';
import { ProjectEntity } from 'src/core/store/projects/projects.model';
import { TasksFacade } from 'src/core/store/tasks/tasks.facade';
import { TaskEntity } from 'src/core/store/tasks/tasks.model';
import { Time } from 'src/core/timeStore/model';
import { TimeStore } from 'src/core/timeStore/timeStore';


@Component({
  selector: 'app-desktop-timer',
  templateUrl: './desktop-timer.component.html',
  styleUrls: ['./desktop-timer.component.scss'],
})
export class DesktopTimerComponent implements OnInit {
  uns$ = new Subject<void>();

  taskChanged$ = new Subject<void>();

  project: ProjectEntity;
  task: TaskEntity;
  
  totalTime: Time;
  projectTime: Time;
  taskTime: Time;

  constructor(
    protected projectsFacade: ProjectsFacade,
    protected tasksFacade: TasksFacade,
    protected timeStore: TimeStore,
    protected cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.subscribeTotalTime();
    this.subscribeActiveTask();
    this.subscribePrevActiveTask();
  }

  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }

  private subscribeTotalTime() {
    this.timeStore.totalTimeChange$
      .pipe(takeUntil(this.uns$))
      .subscribe(totalTime => {
        this.totalTime = totalTime;
        this.cd.detectChanges();
      });
  }

  private getProjectOfTask() {
    this.projectsFacade.entities$
      .pipe(takeUntil(this.uns$), take(1))
      .subscribe(projects => {
        this.project = projects.find(project => project.data.id === this.task.data.project_id);
      });
  }

  private subscribeActiveTask() {
    this.tasksFacade.activeTask$
      .pipe(takeUntil(this.uns$), filter(v => !!v))
      .subscribe(activeTask => {
        this.task = activeTask;
        this.getProjectOfTask();
        this.subscribeTaskTime();
        this.subscribeProjectTime();
      });
  }

  private subscribePrevActiveTask() {
    this.tasksFacade.prevActiveTask$
      .pipe(takeUntil(this.uns$), filter(v => !!v))
      .subscribe(prevActiveTask => {
        this.task = prevActiveTask;
        this.getProjectOfTask();
        this.subscribeTaskTime();
        this.subscribeProjectTime();
      });
  }

  private subscribeTaskTime() {
    this.taskChanged$.next();
    this.taskChanged$.complete();
    this.taskChanged$ = new Subject<void>();

    this.timeStore.tasks.onChange(this.task.timeStoreKey)
      .pipe(takeUntil(this.uns$), takeUntil(this.taskChanged$))
      .subscribe(time => {
        this.taskTime = time;
        this.cd.detectChanges();
      });
  }

  private subscribeProjectTime() {
    const key = `${this.task.data.company_id}:${this.task.data.project_id}`;

    this.timeStore.projects.onChange(key)
      .pipe(takeUntil(this.uns$), takeUntil(this.taskChanged$))
      .subscribe(time => {
        this.projectTime = time;
        this.cd.detectChanges();
      });
  }

  toggleActive() {
    this.tasksFacade.toggleActive(this.task);
  }

  openTask() {
    this.projectsFacade.setSelected(this.task.data.project_id);

    if (!this.task.isSelected) {
      this.tasksFacade.toggleSelected(this.task);
    }
  }

}
