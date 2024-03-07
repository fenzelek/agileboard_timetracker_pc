import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AUTH_KEY } from 'src/core/auth/auth.models';
import { LocalStorageService } from 'src/core/local-storage/local-storage.service';
import { ProjectsFacade } from 'src/core/store/projects/projects.facade';
import { Sprint } from 'src/core/store/projects/projects.model';
import { TasksFacade } from 'src/core/store/tasks/tasks.facade';
import { NewTaskData, Task, TaskEntity } from 'src/core/store/tasks/tasks.model';
import { TimeStore } from 'src/core/timeStore/timeStore';

@Component({
  selector: 'app-mobile-create-task',
  templateUrl: './mobile-create-task.component.html',
  styleUrls: ['./mobile-create-task.component.scss']
})
export class MobileCreateTaskComponent implements OnInit {
  private uns$ = new Subject<void>();

  offlineMode$ = this.timeStore.isOffline$;

  @Output() clickSelected: EventEmitter<void> = new EventEmitter<void>();

  sprints: Sprint[] = [];
  userId = this.ls.getItem(AUTH_KEY)?.user?.id;

  form: FormGroup = this.fb.group({
    name: [null, [Validators.required]],
    sprint_id: [null, Validators.required],
    type_id: [2], // task
    estimate_time: [0],
    reporter_id: [this.userId],
  });

  loading = false;
  task: Task;

  constructor(
    private fb: FormBuilder,
    private tasksFacade: TasksFacade,
    private projectsFacade: ProjectsFacade,
    private ls: LocalStorageService,
    private timeStore: TimeStore,
  ) { }

  ngOnInit(): void {
    this.fetchSprints();
  }

  private fetchSprints() {
    this.projectsFacade.sprints$
      .pipe(takeUntil(this.uns$))
      .subscribe(sprints => {
        this.sprints = sprints;
      });

    this.projectsFacade.sprintsEmpty$
      .pipe(takeUntil(this.uns$), filter(isEmpty => isEmpty))
      .subscribe(() => this.projectsFacade.fetchSprints());
  }

  create(): void {
    if (!this.form.valid) return;

    this.loading = true;

    const data = this.form.value as NewTaskData;
    data.project_id = this.projectsFacade.selectedProject.data.id;

    this.tasksFacade.createTask(data)
      .pipe(takeUntil(this.uns$))
      .subscribe(([error, task]) => {
        if (!error) {
          this.task = task;
          this.clearForm();
        }
        this.loading = false;
      });
  }

  start(): void {
    const taskEntity: TaskEntity = {
      data: this.task,
      isActive: false,
      isSelected: false,
      timeStoreKey: `${this.task.company_id}:${this.task.project_id}:${this.task.id}`,
    };

    this.tasksFacade.toggleActive(taskEntity);
    this.clickSelected.emit();
  }

  private clearForm(): void {
    this.form.get('name')!.setValue(null);
    this.form.get('sprint_id')!.setValue(null);

    this.form.get('name')!.markAsUntouched();
    this.form.get('sprint_id')!.markAsUntouched();
  }

}
