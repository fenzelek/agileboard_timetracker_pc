import { Action, createReducer, on } from '@ngrx/store';

import { authLogout } from '../../auth/auth.actions';

import * as a from './companies.actions';
import { CompaniesState } from './companies.state';
import { CompanyEntity, Company } from './companies.model';
import { setProperty } from '../shared';


export const initialState: CompaniesState = {
  list: [],
  loading: false,
  selectedId: null,
};

const reducer = createReducer(
  initialState,

  on(authLogout, () => initialState),

  on(a.companiesSetSelected, (state: CompaniesState, {id}) => ({
    ...state,
    selectedId: id,
    list: setProperty(state.list, id, 'isSelected'),
  })),

  // fetch
  on(a.companiesEntitiesR, (state: CompaniesState) => {
    return ({
      ...state,
      loading: true,
    });
  }),

  on(a.companiesEntitiesS, (state: CompaniesState, {data}) => ({
    ...state,
    loading: false,
    list: mapInitialCompanies(data),
  })),

  on(a.companiesEntitiesF, (state: CompaniesState) => ({
    ...state,
    loading: false,
  })),
);


function mapInitialCompanies(data: Company[]): CompanyEntity[] {
  return data.map(value => {
    return {
      data: value,
      isSelected: false,
    } as CompanyEntity
  })
}

export function companiesReducer(
  state: CompaniesState | undefined,
  action: Action
): CompaniesState {
  return reducer(state, action);
}
