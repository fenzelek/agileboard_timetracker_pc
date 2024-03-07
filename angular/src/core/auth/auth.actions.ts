import { createAction, props } from '@ngrx/store';
import { UserData } from '../store/projects/projects.model';


export const authLogin = createAction('[Auth] Login');
export const authLogout = createAction('[Auth] Logout');

// login
export const authLoginR = createAction(
  '[Auth] Login r',
  props<{ username: string; password: string }>()
);
export const authLoginS = createAction(
  '[Auth] Login s',
  props<{ token: string }>()
);
export const authLoginF = createAction(
  '[Auth] Login f',
  props<{ error: any }>()
);

// fetch user
export const authFetchUserR = createAction(
  '[Auth] FetchUser r',
  props<{ companyId?: number }>()
);
export const authFetchUserS = createAction(
  '[Auth] FetchUser s',
  props<{ user: UserData }>()
);
export const authFetchUserF = createAction(
  '[Auth] FetchUser f',
  props<{ error: any }>()
);
