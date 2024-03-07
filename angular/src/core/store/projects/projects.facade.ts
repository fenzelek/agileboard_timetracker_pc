import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../core.state';
import { selectCompaniesSelectedId } from '../companies/companies.selectors';
import * as actions from './projects.actions';
import { ProjectEntity } from './projects.model';
import * as selectors from './projects.selectors';


@Injectable()
export class ProjectsFacade {
  loadingProjects$ = this.store.select(selectors.selectProjectsLoading);

  selectedCompanyId$ = this.store.select(selectCompaniesSelectedId);

  selectedProject$ = this.store.select(selectors.selectProjectsSelected);
  selectedProject: ProjectEntity;
  selectedProjectId$ = this.store.select(selectors.selectProjectsSelectedId);

  entities$ = this.store.select(selectors.selectProjectsEntities);
  entitiesEmpty$ = this.store.select(selectors.selectProjectsEntitiesEmpty);

  sprints$ = this.store.select(selectors.selectProjectsSelectedProjectSprints);
  sprintsEmpty$ = this.store.select(selectors.selectProjectsSprintsEmpty);

  users$ = this.store.select(selectors.selectProjectsSelectedProjectUsers);
  usersEmpty$ = this.store.select(selectors.selectProjectsUsersEmpty);
  

  constructor(private store: Store<AppState>) {
    this.selectedProject$.subscribe(project => this.selectedProject = project);
  }

  setSelected(id: number) {
    this.store.dispatch(actions.projectsSetSelected({ id }));
  }

  fetchProjects() {
    this.store.dispatch(actions.projectsEntitiesR());
  }
  
  fetchUsers() {
    this.store.dispatch(actions.projectsUsersR());
  }

  fetchSprints() {
    this.store.dispatch(actions.projectsSprintsR());
  }
}
