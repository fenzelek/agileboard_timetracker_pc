import { Action, createReducer, on } from '@ngrx/store';

import { authLogout } from '../../auth/auth.actions';
import * as a from './tasks.actions';
import { TasksState } from './tasks.state';
import { TaskEntity, Task, TaskEntitiesMap, TaskDetails, TaskStatusesMap, TaskAutoAssignMeMap } from './tasks.model';
import { ProjectStatus } from '../projects/projects.model';

export type TaskProp = 'isSelected' | 'isActive';

const initialAutoAssignedMe = localStorage.getItem('tt-autoAssignedMe');

export const initialState: TasksState = {
  map: new TaskEntitiesMap(),
  loading: false,
  detailsLoading: false,
  selected: {
    projectId: null,
    taskId: null,
  },
  active: {
    projectId: null,
    taskId: null,
  },
  prevActive: {
    projectId: null,
    taskId: null,
  },
  statuses: new TaskStatusesMap(),
  autoAssignMe: initialAutoAssignedMe ? convertInitialAutoAssignMeToMap(initialAutoAssignedMe) : new TaskAutoAssignMeMap()
};

const reducer = createReducer(
  initialState,

  on(authLogout, () => initialState),

  on(a.tasksReset, () => initialState),

  on(a.tasksToggleSelected, (state: TasksState, { projectId, taskId }) => {
    const task = state.map.get(projectId).find(entity => entity.data.id === taskId);
    const newValue = !task.isSelected;
    const selected = newValue ? {
      projectId,
      taskId,
    } : {
      projectId: null,
      taskId: null,
    };

    return {
      ...state,
      selected,
      map: toggleSelected(state.map, projectId, taskId),
    }
  }),

  on(a.tasksToggleActive, (state: TasksState, { projectId, taskId }) => {
    const task = state.map.get(projectId).find(entity => entity.data.id === taskId);

    const newValue = !task.isActive;
    let active, prevActive;

    if (newValue) {
      active = { projectId, taskId };
      prevActive = { projectId: null, taskId: null };
    } else {
      active = { projectId: null, taskId: null };
      prevActive = { ...state.active };
    }

    return {
      ...state,
      active,
      prevActive,
      map: toggleActive(state.map, projectId, taskId),
    }
  }),

  // entities
  on(a.tasksEntitiesR, (state: TasksState) => {
    return ({
      ...state,
      loading: true,
    });
  }),

  on(a.tasksEntitiesS, (state: TasksState, { data, projectId }) => ({
    ...state,
    loading: false,
    map: wrapTasksAsEntities(state, data, projectId),
  })),

  on(a.tasksEntitiesF, (state: TasksState) => ({
    ...state,
    loading: false,
  })),

  // add task
  on(a.tasksAddR, (state: TasksState, { data }) => ({
    ...state,
    loading: true,
  })),

  on(a.tasksAddS, (state: TasksState, { task }) => ({
    ...state,
    map: addTask(state.map, task),
    loading: false,
  })),

  on(a.tasksAddF, (state: TasksState, { error }) => ({
    ...state,
    loading: false,
  })),

  // details
  on(a.taskDetailsR, (state: TasksState) => {
    return ({
      ...state,
      detailsLoading: true,
    });
  }),

  on(a.taskDetailsS, (state: TasksState, { task, details }) => ({
    ...state,
    detailsLoading: false,
    map: setDetails(state.map, task, details),
  })),

  on(a.taskDetailsF, (state: TasksState) => ({
    ...state,
    detailsLoading: false,
  })),

  on(a.tasksSetStatuses, (state: TasksState, { data, projectId }) => ({
    ...state,
    statuses: wrapProjectStatusArrayAsMap(state, data, projectId),
  })),
);


function wrapTasksAsEntities(state: TasksState, data: Task[], projectId: number): TaskEntitiesMap {
  const mapClone = new TaskEntitiesMap();
  const taskEntities: TaskEntity[] = [];

  state.map.forEach((val, key) => {
    mapClone.set(key, val);
  });

  mapClone.set(projectId, taskEntities);

  data.forEach(task => {
    const entity: TaskEntity = {
      data: task,
      details: null,
      isActive: state.active.projectId === projectId && task.id === state.active.taskId,
      isSelected: state.selected.projectId === projectId && task.id === state.selected.taskId,
      timeStoreKey: `${task.company_id}:${task.project_id}:${task.id}`,
    };
    taskEntities.push(entity);
  });

  return mapClone;
}

function wrapProjectStatusArrayAsMap(state: TasksState, data: ProjectStatus[], projectId: number): TaskStatusesMap {
  const mapClone = new TaskStatusesMap();
  const statusEntities: ProjectStatus[] = data.map((status) => ({
    id: status.id,
    project_id: status.project_id,
    name: status.name,
    priority: status.priority,
    created_at: status.created_at,
    updated_at: status.updated_at
  }));

  state.statuses.forEach((val, key) => {
    mapClone.set(key, val);
  });

  mapClone.set(projectId, statusEntities);

  return mapClone;
}

function toggleActive(map: TaskEntitiesMap, projectId: number, taskId: number): TaskEntitiesMap {
  // clone TaskEntitiesMap
  const mapClone = new TaskEntitiesMap();
  map.forEach((val, key) => {
    mapClone.set(key, val.map(entity => ({ ...entity })));
  });

  const entities = mapClone.get(projectId);
  const entity = entities.find(entity => entity.data.id === taskId);
  const newVal = !entity.isActive;

  // set false for all tasks in all projects
  mapClone.forEach(entities => {
    entities.forEach(entity => {
      entity.isActive = false;
    });
  });

  // toggle prop
  entity.isActive = newVal;

  return mapClone;
}

function toggleSelected(map: TaskEntitiesMap, projectId: number, taskId: number): TaskEntitiesMap {
  // clone TaskEntitiesMap
  const mapClone = new TaskEntitiesMap();
  map.forEach((val, key) => {
    mapClone.set(key, val);
  });

  const entitiesClone = mapClone.get(projectId).map(entity => ({ ...entity }));
  mapClone.set(projectId, entitiesClone);

  entitiesClone.forEach(entity => {
    if (entity.data.id === taskId)
      entity.isSelected = !entity.isSelected;
    else
      entity.isSelected = false;
  });

  return mapClone;
}

function setDetails(map: TaskEntitiesMap, task: TaskEntity, details: TaskDetails) {
  const mapClone = new TaskEntitiesMap();
  map.forEach((val, key) => {
    mapClone.set(key, val);
  });

  const entities = mapClone.get(task.data.project_id);
  const entityIndex = entities.findIndex(entity => entity.data.id == task.data.id);

  const entityClone = { ...entities[entityIndex] };
  entityClone.details = details;

  entities[entityIndex] = entityClone;

  return mapClone;
}

function addTask(map: TaskEntitiesMap, task: Task) {
  const mapClone = new TaskEntitiesMap();
  map.forEach((val, key) => {
    mapClone.set(key, val);
  });

  const taskEntity: TaskEntity = {
    data: task,
    details: null,
    isActive: false,
    isSelected: false,
    timeStoreKey: `${task.company_id}:${task.project_id}:${task.id}`,
  };

  mapClone.get(task.project_id).unshift(taskEntity);

  return mapClone;
}

// converter because key is a string using Object.entries
function convertInitialAutoAssignMeToMap(value: string) {
  return new TaskAutoAssignMeMap(Object.entries(JSON.parse(initialAutoAssignedMe)));
}


export function tasksReducer(
  state: TasksState | undefined,
  action: Action
): TasksState {
  return reducer(state, action);
}
