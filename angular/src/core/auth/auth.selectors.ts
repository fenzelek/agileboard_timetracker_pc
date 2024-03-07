import { createSelector, createFeatureSelector } from '@ngrx/store';

import { AppState } from '../core.state';
import { AuthState } from './auth.models';


export const selectAuthState = createFeatureSelector
  <AppState, AuthState>('auth');


export const selectAuth = createSelector(
  selectAuthState,
  (state: AuthState) => state
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectAuthEmail = createSelector(
  selectAuthState,
  (state: AuthState) => state.email
);

export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);
