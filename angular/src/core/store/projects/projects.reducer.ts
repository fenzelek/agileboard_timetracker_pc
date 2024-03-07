import { Action, createReducer, on } from '@ngrx/store';

import { authLogout } from '../../auth/auth.actions';

import * as a from './projects.actions';
import { ProjectsState } from './projects.state';
import { ProjectEntity, Project } from './projects.model';
import { clone, setProperty } from '../shared';


export const initialState: ProjectsState = {
  list: [],
  loading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,

  on(authLogout, () => initialState),

  on(a.projectsReset, () => initialState),

  // setters
  on(a.projectsSetSelected, (state: ProjectsState, {id}) => {
    return {
      ...state,
      selectedId: id,
      list: setProperty(state.list, id, 'isSelected'),
    }
  }),

  // fetch entities
  on(a.projectsEntitiesR, (state: ProjectsState) => {
    return ({
      ...state,
      loading: true,
    });
  }),

  // projects
  on(a.projectsEntitiesS, (state: ProjectsState, {data}) => ({
    ...state,
    loading: false,
    list: parseProjects(state, data),
  })),

  on(a.projectsEntitiesF, (state: ProjectsState) => ({
    ...state,
    loading: false,
  })),

  // selected project users
  on(a.projectsUsersS, (state: ProjectsState, {users} ) => ({
    ...state,
    list: setProjectProperty(state.list, state.selectedId, 'users', users),
  })),

  // selected project sprints
  on(a.projectsSprintsS, (state: ProjectsState, {sprints} ) => ({
    ...state,
    list: setProjectProperty(state.list, state.selectedId, 'sprints', sprints),
  })),

);


function parseProjects(state: ProjectsState, data: Project[]): ProjectEntity[] {
  return data.map(project => {
    return {
      data: project,
      isSelected: state.selectedId === project.id,
      timeStoreKey: `${project.company_id}:${project.id}`,
    } as ProjectEntity;
  });
}


function setProjectProperty(list: ProjectEntity[], selectedId: number, prop: any, value: any) {
  const listClone: any[] = clone(list);
  const entity = listClone.find(el => el.data.id === selectedId);

  if (entity)
    entity.data[prop] = value;
  else
    console.warn('setProjectProperty error: project not found', 'project id:', selectedId, 'prop:', prop);

  return listClone;
}

export function projectsReducer(
  state: ProjectsState | undefined,
  action: Action,
): ProjectsState {
  return reducer(state, action);
}
