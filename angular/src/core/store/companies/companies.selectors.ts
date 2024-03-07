import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompaniesState } from './companies.state';
import { AppState } from 'src/core/core.state';


export const selectCompaniesState = createFeatureSelector<AppState, CompaniesState>(
  'companies'
);

export const selectCompaniesEntities = createSelector(
  selectCompaniesState,
  (state: CompaniesState) => state.list
);

export const selectCompaniesLoading = createSelector(
  selectCompaniesState,
  (state: CompaniesState) => state.loading
);

// selected
export const selectCompaniesSelectedId = createSelector(
  selectCompaniesState,
  (state: CompaniesState) => state.selectedId
);

export const selectCompaniesSelected = createSelector(
  selectCompaniesEntities,
  selectCompaniesSelectedId,
  (entities, selectedId) => {
    return selectedId ? entities.find(entity => entity.data.id === selectedId) : null;
  }
);
