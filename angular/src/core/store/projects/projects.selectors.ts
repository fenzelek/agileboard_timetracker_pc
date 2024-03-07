import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectsState } from './projects.state';
import { ProjectEntity } from './projects.model';
import { AppState } from 'src/core/core.state';


export const selectProjectsState = createFeatureSelector<AppState, ProjectsState>(
  'projects'
);

// loading list
export const selectProjectsLoading = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.loading
);

// project list
export const selectProjectsEntities = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.list
);

export const selectProjectsEntitiesEmpty = createSelector(
  selectProjectsEntities,
  (list) => !list.length
);

// selected
export const selectProjectsSelectedId = createSelector(
  selectProjectsState,
  (state: ProjectsState) => state.selectedId
);

export const selectProjectsSelected = createSelector(
  selectProjectsEntities,
  selectProjectsSelectedId,
  (entities, selectedId) => {
    return selectedId ? findProject(entities, selectedId) : null;
  }
);

export const selectProjectsSelectedProjectSprints = createSelector(
  selectProjectsSelected,
  (project) => {
    return project ? project.data.sprints : null;
  }
);

export const selectProjectsSelectedProjectUsers = createSelector(
  selectProjectsSelected,
  (project) => {
    return project ? project.data.users : null;
  }
);

// selected project users empty
export const selectProjectsUsersEmpty = createSelector(
  selectProjectsSelected,
  (project) => {
    return project && !project.data.users ? true : false;
  }
);

// selected project sprints empty
export const selectProjectsSprintsEmpty = createSelector(
  selectProjectsSelected,
  (project) => {
    return project && !project.data.sprints ? true : false;
  }
);


function findProject(entities: ProjectEntity[], id: Number): ProjectEntity {
  return entities.find(value => {
    return value.data.id === id;
  });
}
