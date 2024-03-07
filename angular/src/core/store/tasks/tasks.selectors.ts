import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.state';
import { AppState } from 'src/core/core.state';
import { selectProjectsSelectedId } from '../projects/projects.selectors';
import { selectCompaniesSelectedId } from '../companies/companies.selectors';


export const selectTasksState = createFeatureSelector<AppState, TasksState>(
  'tasks'
);


export const selectTasksEntitiesMap = createSelector(
  selectTasksState,
  (state: TasksState) => state.map
);

export const selectTasksStatusesMap = createSelector(
  selectTasksState,
  (state: TasksState) => state.statuses
);

export const selectAutoAssignMeMap = createSelector(
  selectTasksState,
  (state: TasksState) => state.autoAssignMe
);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state: TasksState) => state.loading
);
export const selectTasksDetailsLoading = createSelector(
  selectTasksState,
  (state: TasksState) => state.detailsLoading
);


// get task list of selected project
export const selectTasksSelectedProjectTasks = createSelector(
  selectProjectsSelectedId,
  selectTasksEntitiesMap,
  (projectId, entitiesMap) => {
    return entitiesMap.get(projectId);
  }
);

export const selectTasksSelectedProjectTasksEmpty = createSelector(
  selectProjectsSelectedId,
  selectTasksEntitiesMap,
  (projectId, entitiesMap) => projectId ? !entitiesMap.get(projectId) : false,
);

// selected
export const selectTasksSelectedId = createSelector(
  selectTasksState,
  (state: TasksState) => state.selected.taskId
);

export const selectTasksSelected = createSelector(
  selectTasksState,
  selectProjectsSelectedId,
  (state, projectId) => {
    const tasks = state.map.get(projectId);
    return tasks ? tasks.find(task => task.isSelected) : null;
  }
);

// active
export const selectTasksActiveId = createSelector(
  selectTasksState,
  (state: TasksState) => state.active.taskId
);

export const selectTasksActive = createSelector(
  selectTasksState,
  state => {
    const tasks = state.map.get(state.active.projectId);
    return tasks ? tasks.find(task => task.isActive) : null;
  }
);

// last active
export const selectTasksPrevActive = createSelector(
  selectTasksState,
  (state) => {
    const tasks = state.map.get(state.prevActive.projectId);
    return tasks ? tasks.find(task => task.data.id === state.prevActive.taskId) : null;
  }
);

// get status list of selected project
export const selectTasksStatuses = createSelector(
  selectProjectsSelectedId,
  selectTasksStatusesMap,
  (projectId, statusesMap) => {
    return statusesMap.get(projectId);
  }
);

// get status list of selected project
export const selectAutoAssignMe = createSelector(
  selectCompaniesSelectedId,
  selectProjectsSelectedId,
  selectAutoAssignMeMap,
  (companyId, projectId, autoAssignMeMap) => {
    return autoAssignMeMap.get(`${companyId}:${projectId}`);
  }
);