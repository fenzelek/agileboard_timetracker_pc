import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as a from './projects.actions';
import { Project, Sprint, User } from './projects.model';
import { AppState } from 'src/core/core.state';
import { select, Store } from '@ngrx/store';
import { selectProjectsSelectedId } from './projects.selectors';
import { selectCompaniesSelectedId } from '../companies/companies.selectors';
import { OfflineService } from 'src/app/services/offline.service';
import { TimeStore } from 'src/core/timeStore/timeStore';

export const PROJECTS_KEY = 'PROJECTS';

interface ProjectsResponse {
  data: Project[];
}
interface SprintsResponse {
  data: Sprint[];
}
interface UsersResponse {
  data: User[];
}


@Injectable()
export class ProjectsEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>,
    private offlineService: OfflineService,
    private timeStore: TimeStore,
  ) { }

  entitiesR = createEffect(() =>
    this.actions$.pipe(
      ofType(a.projectsEntitiesR),

      withLatestFrom(
        this.store.pipe(select(selectCompaniesSelectedId)),
        (action, companyId) => ({ companyId })
      ),

      switchMap(({ companyId }) => {

        if (this.timeStore.isOffline) {
          return this.offlineService.cache.getProjects(companyId).pipe(
            map(projects => a.projectsEntitiesS({ data: projects }))
          );
        }

        return this.http.get<ProjectsResponse>(`/projects?selected_company_id=${companyId}&status=opened&has_access=1`).pipe(
          tap(res => {
            this.offlineService.cache.setProjects(companyId, res.data);
          }),
          map(projectsResp => 
            a.projectsEntitiesS({ data: projectsResp.data })
          ),
          catchError((error: HttpResponse<any>) =>
            of(a.projectsEntitiesF({ error }))
          )
        );

      })
    )
  );

  sprintsR = createEffect(() =>
    this.actions$.pipe(
      ofType(a.projectsSprintsR),

      withLatestFrom(
        this.store.pipe(select(selectCompaniesSelectedId)),
        this.store.pipe(select(selectProjectsSelectedId)),
        (action, companyId, projectId) => ({ companyId, projectId })
      ),

      switchMap(({ companyId, projectId }) => {

        if (this.timeStore.isOffline) {
          return this.offlineService.cache.getSprints(companyId, projectId).pipe(
            map(sprints => a.projectsSprintsS({ projectId, sprints }))
          );
        }

        return this.http.get<SprintsResponse>(`/projects/${projectId}/sprints?selected_company_id=${companyId}&status=not-closed`).pipe(
          tap(res => {
            this.offlineService.cache.setSprints(companyId, projectId, res.data);
          }),
          map(sprintsResp =>
            a.projectsSprintsS({ projectId, sprints: sprintsResp.data })
          ),
          catchError((error: HttpResponse<any>) =>
            of(a.projectsEntitiesF({ error }))
          )
        )

      })
    )
  );

  usersR = createEffect(() =>
    this.actions$.pipe(
      ofType(a.projectsUsersR),

      withLatestFrom(
        this.store.pipe(select(selectCompaniesSelectedId)),
        this.store.pipe(select(selectProjectsSelectedId)),
        (action, companyId, projectId) => ({ companyId, projectId })
      ),

      switchMap(({ companyId, projectId }) => {

        if (this.timeStore.isOffline) {
          return this.offlineService.cache.getUsers(companyId, projectId).pipe(
            map(users => a.projectsUsersS({ users }))
          );
        }
      
        return this.http.get<UsersResponse>(`/projects/${projectId}/users?selected_company_id=${companyId}`).pipe(
          tap(res => {
            this.offlineService.cache.setUsers(companyId, projectId, res.data);
          }),
          map((res: any) => 
            a.projectsUsersS({ users: parseUsers(res.data) })
          ),
          catchError((error: HttpResponse<any>) => of(a.projectsUsersF({ error }))),
        )
      })

    )
  );

  // fetch project sprints if empty on project change
  // selectedChanged = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(a.projectsSetSelected),
  //     withLatestFrom(
  //       this.store.pipe(select(selectProjectsSelectedProjectSprints))
  //     ),
  //     filter(([action, sprints]) => !sprints),
  //     tap(() =>
  //       this.store.dispatch(a.projectsSprintsR())
  //     ),
  //   ),
  //   { dispatch: false }
  // );
}


function parseUsers(users: User[]) {
  users.forEach(user => {
    user.user.data.fullName = `${user.user.data.first_name} ${user.user.data.last_name}`;
  })
  return users;
}
