import {createAction, props} from '@ngrx/store';
import {Project, Sprint, User} from './projects.model';


export const projectsReset = createAction('[Projects] Reset data to initial');

// get all projects
export const projectsEntitiesR = createAction(
  '[Projects] Entities - Request',
);

export const projectsEntitiesS = createAction(
  '[Projects] Fetch entities - Success',
  props<{ data: Project[] }>()
);

export const projectsEntitiesF = createAction(
  '[Projects] Fetch entities - Fail',
  props<{ error: any }>()
);

// project users
export const projectsUsersR = createAction(
  '[Projects] Fetch project users - Request',
);

export const projectsUsersS = createAction(
  '[Projects] Fetch project users - Success',
  props<{ users: User[] }>()
);

export const projectsUsersF = createAction(
  '[Projects] Fetch project users - Failure',
  props<{ error: any }>()
);

// project sprints
export const projectsSprintsR = createAction(
  '[Projects] Fetch project sprints - Request',
);

export const projectsSprintsS = createAction(
  '[Projects] Fetch project sprints - Success',
  props<{ projectId: number, sprints: Sprint[] }>()
);

export const projectsSprintsF = createAction(
  '[Projects] Fetch project sprints - Failure',
  props<{ error: any }>()
);

// setters
export const projectsSetSelected = createAction(
  '[Projects] Set selected project id',
  props<{ id: number }>()
);
