import {createAction, props} from '@ngrx/store';
import { ProjectStatus } from '../projects/projects.model';
import {NewTaskData, Task, TaskDetails, TaskEntity} from './tasks.model';


export const tasksReset = createAction('[Tasks] Reset data to initial');

// get all tasks
export const tasksEntitiesR = createAction('[Tasks] Entities - Request');

export const tasksEntitiesS = createAction(
  '[Tasks] Fetch entities - Success',
  props<{ data: Task[], projectId: number }>()
);

export const tasksEntitiesF = createAction(
  '[Tasks] Fetch entities - Fail',
  props<{ error: any }>()
);

// add task
export const tasksAddR = createAction(
  '[Tasks] Add task - Request',
  props<{ data: NewTaskData }>()
);
export const tasksAddS = createAction(
  '[Tasks] Add task - Success',
  props<{ task: Task }>()
);
export const tasksAddF = createAction(
  '[Tasks] Add task - Fail',
  props<{ error: any }>()
);

// task details
export const taskDetailsR = createAction(
  '[Tasks] Fetch task details - Request',
  props<{ task: TaskEntity }>()
);

export const taskDetailsS = createAction(
  '[Tasks] Fetch task details - Success',
  props<{ task: TaskEntity, details: TaskDetails }>()
);

export const taskDetailsF = createAction(
  '[Tasks] Fetch task details - Fail',
  props<{ error: any }>()
);

// setters
export const tasksToggleActive = createAction(
  '[Tasks] Toggle task isActive',
  props<{ projectId: number, taskId: number }>()
);

export const tasksToggleSelected = createAction(
  '[Tasks] Toggle task isSelected',
  props<{ projectId: number, taskId: number }>()
);

export const tasksSetStatuses = createAction(
  '[Tasks] Set statuses',
  props<{ projectId: number, data: ProjectStatus[] }>()
);

export const setAutoAssignMe = createAction(
  '[Tasks] Set auto assign me',
  props<{ value: boolean }>()
);
