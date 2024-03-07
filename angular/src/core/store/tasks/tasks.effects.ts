import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as a from './tasks.actions';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/core/core.state';
import { selectProjectsSelectedId } from '../projects/projects.selectors';
import { selectCompaniesSelectedId } from '../companies/companies.selectors';
import { Task, TaskDetails } from './tasks.model';
import { CompaniesFacade } from '../companies/companies.facade';
import { OfflineService } from 'src/app/services/offline.service';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { TasksService } from './tasks.service';
import { ProjectStatus } from '../projects/projects.model';
import { selectAutoAssignMeMap, selectTasksStatuses, selectTasksStatusesMap } from './tasks.selectors';
import { LocalStorageService } from 'src/core/local-storage/local-storage.service';


interface TasksResp {
  data: ProjectStatus[];
}

@Injectable()
export class TasksEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>,
    private companiesFacade: CompaniesFacade,
    private offlineService: OfflineService,
    private timeStore: TimeStore,
    private tasksService: TasksService,
    private localStorageService: LocalStorageService
  ) { }

  // tasks
  entitiesR = createEffect(() =>
    this.actions$.pipe(
      ofType(a.tasksEntitiesR),

      withLatestFrom(
        this.store.pipe(select(selectCompaniesSelectedId)),
        this.store.pipe(select(selectProjectsSelectedId)),
        (action, companyId, projectId) => ({ companyId, projectId })
      ),

      switchMap(({ companyId, projectId }) => {

        if (this.timeStore.isOffline) {
          return this.offlineService.cache.getTasks(companyId, projectId).pipe(
            map(tasks => a.tasksEntitiesS({ data: this.tasksService.parseTasks(tasks, companyId), projectId }))
          );
        }

        return this.http.get<TasksResp>(`/projects/${projectId}/statuses?backlog=0&tickets=1&selected_company_id=${companyId}`).pipe(
          tap(res => {
            this.offlineService.cache.setTasks(companyId, projectId, this.tasksService.parseProjectStatusArrayToTasks(res.data));
          }),

          map(res => {
            this.store.dispatch(a.tasksSetStatuses({ projectId, data: res.data }));
            return a.tasksEntitiesS({ data: this.tasksService.parseTasks(this.tasksService.parseProjectStatusArrayToTasks(res.data), companyId), projectId });
          } ),
          catchError((error: HttpResponse<any>) => of(a.tasksEntitiesF({ error }))),
        )

      }),
    ),
    { dispatch: true }
  );

  entitiesF = createEffect(() =>
    this.actions$.pipe(ofType(a.tasksEntitiesF),
      tap((err) => {
        console.error(err);
      }),
    ),
    { dispatch: false }
  );

  // task details
  detailsR = createEffect(() =>
    this.actions$.pipe(
      ofType(a.taskDetailsR),

      tap(({ task }) => {
        if (this.timeStore.isOffline) {
          this.offlineService.cache.getTaskDetails(task.data.company_id, task.data.project_id, task.data.id).subscribe(details => {
            if (details) {
              this.store.dispatch(a.taskDetailsS({ task, details }));
            } else {
              this.store.dispatch(a.taskDetailsF({ error: null }));
            }
          });
        } else {
          const url = `projects/${task.data.project_id}/tickets/${task.data.id}?selected_company_id=${task.data.company_id}`;
  
          this.http.get<{ data: TaskDetails }>(url).subscribe(res => {
            this.offlineService.cache.setTaskDetails(task.data.company_id, task.data.project_id, task.data.id, res.data);
            this.store.dispatch(a.taskDetailsS({ task, details: res.data }));
          }, error => {
            this.store.dispatch(a.taskDetailsF({ error }));
          });
        }
      }),

    ),
    { dispatch: false }
  );

  // add task
  addTaskR = createEffect(() =>
    this.actions$.pipe(ofType(a.tasksAddR),
    withLatestFrom(
      this.store.pipe(select(selectCompaniesSelectedId)),
      this.store.pipe(select(selectProjectsSelectedId)),
      this.store.pipe(select(selectTasksStatuses)),
      ({ data }, companyId, projectId, statuses) => ({ companyId, projectId, statuses, data })
    ),
      switchMap(({ companyId, projectId, statuses, data }) => {

        const url = `/projects/${projectId}/tickets?selected_company_id=${companyId}`;
    
        return this.http.post<{ data: Task }>(url, data).pipe(
          map(resp => {
            let task: Task = { ...resp.data, assigned_user: {}, status: this.tasksService.findStatusById(statuses, resp.data.status_id)};
            task = this.tasksService.parseTasks([task], companyId)[0];
            return task;
          }),
          map(task => a.tasksAddS({ task })),
          catchError((error: HttpResponse<any>) => of(a.tasksAddF({ error }))),
        );

      }),
    ),
    { dispatch: true }
  );

  setAutoAssignMe = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          a.setAutoAssignMe
        ),
        withLatestFrom(
          this.store.select(selectCompaniesSelectedId),
          this.store.select(selectProjectsSelectedId),
          this.store.select(selectAutoAssignMeMap)
        ),
        tap(([{ value }, companyId, projectId, map]) => {
          map.set(`${companyId}:${projectId}`, value);
          this.localStorageService.setItem('autoAssignedMe', Object.fromEntries(map))
          }
        )
      ),
    { dispatch: false }
  );

}


