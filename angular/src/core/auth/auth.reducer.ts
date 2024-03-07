import { AuthState } from './auth.models';
import { createReducer, on, Action } from '@ngrx/store';
import * as a from './auth.actions';


export const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  email: null,
  loading: false,
  user: null,
};

const reducer = createReducer(
  initialState,

  on(a.authLoginR, (state, { username }) => ({
    ...state,
    email: username,
    loading: true
  })),

  on(a.authLoginS, (state, { token }) => ({
    ...state,
    isAuthenticated: true,
    token: token,
    loading: false
  })),

  on(a.authFetchUserS, (state, { user }) => ({
    ...state,
    user,
  })),

  on(a.authFetchUserF, (state, { error }) => ({
    ...state,
  })),

  on(a.authLoginF, (state) => ({
    ...state,
    isAuthenticated: false,
    token: null,
    loading: false
  })),

  on(a.authLogout, state => ({
    isAuthenticated: false,
    token: state.token,
    email: null,
    loading: false,
    user: null,
  }))

);

export function authReducer(
  state: AuthState | undefined,
  action: Action
): AuthState {
  return reducer(state, action);
}
