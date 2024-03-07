import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../core.state';
import { selectProjectsSelectedId } from '../projects/projects.selectors';
import * as actions from './tasks.actions';
import * as tasksSelectors from './tasks.selectors';
import { NewTaskData, Task, TaskEntity } from './tasks.model';
import { ProjectsFacade } from '../projects/projects.facade';
import { Time } from 'src/core/timeStore/model';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { ProjectEntity } from '../projects/projects.model';
@Injectable()
export class TasksFacade {
  loadingTasks$ = this.store.select(tasksSelectors.selectTasksLoading);
  loadingDetails$ = this.store.select(tasksSelectors.selectTasksDetailsLoading);

  selectedProjectId$ = this.store.select(selectProjectsSelectedId);
  selectedProjectTasks$ = this.store.select(tasksSelectors.selectTasksSelectedProjectTasks);
  selectedProjectStatuses$ = this.store.select(tasksSelectors.selectTasksStatuses);
  projectTasksEmpty$ = this.store.select(tasksSelectors.selectTasksSelectedProjectTasksEmpty);

  activeTask$ = this.store.select(tasksSelectors.selectTasksActive);
  prevActiveTask$ = this.store.select(tasksSelectors.selectTasksPrevActive);
  activeTask: TaskEntity;
  prevActiveTask: TaskEntity;
  projects: ProjectEntity[];

  activeTaskId$ = this.store.select(tasksSelectors.selectTasksActiveId);
  selectedTaskId$ = this.store.select(tasksSelectors.selectTasksSelectedId);
  selectedTask$ = this.store.select(tasksSelectors.selectTasksSelected);
  autoAssignMe$ = this.store.select(tasksSelectors.selectAutoAssignMe);

  constructor(
    private store: Store<AppState>,
    private projectsFacade: ProjectsFacade,
    private timeStore: TimeStore,
    private actions$: Actions,
  ) {
    this.activeTask$.subscribe(task => this.activeTask = task);
    this.prevActiveTask$.subscribe(task => this.prevActiveTask = task);
    this.projectsFacade.entities$.subscribe(entities => this.projects = entities);
  }

  toggleSelected(task: TaskEntity) {
    this.store.dispatch(actions.tasksToggleSelected({ projectId: task.data.project_id, taskId: task.data.id }));
  }

  toggleActive(task: TaskEntity) {
    const doStart = !task.isActive;

    this.store.dispatch(actions.tasksToggleActive({ projectId: task.data.project_id, taskId: task.data.id }));

    doStart ? 
      this.timeStore.start({
        companyId: task.data.company_id,
        projectName: this.projects.find((project) =>  project.data.id === task.data.project_id).data.name,
        taskName: task.data.title + ' ' + task.data.name,
        projectId: task.data.project_id,
        taskId: task.data.id,
      }) : 
      this.timeStore.stop();
  }

  fetchTasks() {
    this.store.dispatch(actions.tasksEntitiesR());
  }

  fetchDetails(task: TaskEntity) {
    this.store.dispatch(actions.taskDetailsR({ task }));
  }

  setAutoAssignMe(value: boolean) {
    this.store.dispatch(actions.setAutoAssignMe({ value }));
  }

  displayDate(time: Time) {
    return (time?.hours ? time.hours : '0') + 'h:' +
      (time?.minutes ? time.minutes : '0') + 'm:' +
      (time?.seconds ? time.seconds : '0') + 's'
  }

  createTask(data: NewTaskData): Observable<[any, Task]> {
    this.store.dispatch(actions.tasksAddR({ data }));

    return this.actions$.pipe(
      ofType(actions.tasksAddS, actions.tasksAddF),
      map((action) => 
        action.type === '[Tasks] Add task - Success' ? [null, action.task] : [action.error, null]
      ),
    )
  }

}
