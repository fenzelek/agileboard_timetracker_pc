import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/core/core.state';
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';
import { TasksFacade } from 'src/core/store/tasks/tasks.facade';
import { TaskEntity } from 'src/core/store/tasks/tasks.model';
import { TasksService } from 'src/core/store/tasks/tasks.service';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { ElectronService } from 'src/electronService/electron.service';
import { DesktopTaskDetailsComponent } from '../../desktop/desktop-task-details/desktop-task-details.component';

interface UserData {
  first_name: string;
  last_name: string;
}

@Component({
  selector: 'app-mobile-task-details-dialog',
  templateUrl: './mobile-task-details-dialog.component.html',
  styleUrls: ['./mobile-task-details-dialog.component.scss']
})
export class MobileTaskDetailsDialogComponent extends DesktopTaskDetailsComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TaskEntity,
    protected store: Store<AppState>,
    private translate: TranslateService,
    protected projectsFacade: ProjectsFacade,
    protected tasksFacade: TasksFacade,
    protected tasksService: TasksService,
    protected timeStore: TimeStore,
    protected sanitizer: DomSanitizer,
    protected electronService: ElectronService,
  ) {
    super(store, projectsFacade, tasksFacade, tasksService, timeStore, sanitizer, electronService);
    this.task = data;
  }

  // override
  ngOnInit(): void {
    this.subscribeDetailsLoading();
    this.subscribeTime();
    this.subscribeTask();
  }

  subscribeTask() {
    this.store.select(state =>
      state.tasks.map
        .get(this.task.data.project_id)
        .find(task => task.data.id === this.task.data.id)
    )
    .pipe(takeUntil(this.uns$))
    .subscribe(task => {
      this.task = task;
      this.fetchTaskDetails();
    });
  }

  getUserLabel(data: UserData | undefined): string {
    if (!data) return this.translate.instant('tt.tasks.no-user');
    return `${data.first_name} ${data.last_name}`;
  }

}
