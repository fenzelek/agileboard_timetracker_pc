import {ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { initStateFromLocalStorage } from './meta-reducers/init-state-from-local-storage.reducer';
import { debug } from './meta-reducers/debug.reducer';
import { AuthState } from './auth/auth.models';
import { authReducer } from './auth/auth.reducer';
import { RouterStateUrl } from './router/router.state';
import { AuthEffects } from './auth/auth.effects';
import { environment } from '../environments/environment';
import { SettingsState } from './settings/settings.model';
import { settingsReducer } from './settings/settings.reducer';
import { SettingsEffects } from './settings/settings.effects';
import { ProjectsState } from "./store/projects/projects.state";
import { projectsReducer } from "./store/projects/projects.reducer";
import { ProjectsEffects } from "./store/projects/projects.effects";
import { statsReducer } from './store/stats/stats.reducer';
import { StatsState } from './store/stats/stats.state';
import { companiesReducer } from './store/companies/companies.reducer';
import { CompaniesState } from './store/companies/companies.state';
import { CompaniesEffects } from './store/companies/companies.effects';
import { StatsEffects } from './store/stats/stats.effects';
import { TasksEffects } from './store/tasks/tasks.effects';
import { TasksState } from './store/tasks/tasks.state';
import { tasksReducer } from './store/tasks/tasks.reducer';


export const metaReducers: MetaReducer<AppState>[] = [
  initStateFromLocalStorage
];

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  auth: authReducer,
  settings: settingsReducer,
  stats: statsReducer,
  companies: companiesReducer,
  projects: projectsReducer,
  tasks: tasksReducer,
};

export const effects: any[] = [
  AuthEffects,
  SettingsEffects,
  StatsEffects,
  CompaniesEffects,
  ProjectsEffects,
  TasksEffects,
];

if (!environment.production && !environment.test) {
  metaReducers.unshift(debug);
}

export interface AppState {
  router: RouterReducerState<RouterStateUrl>;
  auth: AuthState;
  settings: SettingsState;
  stats: StatsState;
  companies: CompaniesState;
  projects: ProjectsState;
  tasks: TasksState;
}
