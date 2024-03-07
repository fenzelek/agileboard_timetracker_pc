import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../core.state';
import * as actions from './auth.actions';
import * as selectors from './auth.selectors';
import { first, map, take } from 'rxjs/operators';
import { UserData, UserRole } from '../store/projects/projects.model';
import { Observable } from 'rxjs';
import { CompaniesFacade } from '../store/companies/companies.facade';


@Injectable()
export class AuthFacade {
  isAuthenticated$ = this.store.select(selectors.selectIsAuthenticated);
  isAuthenticated: boolean;

  token$ = this.store.select(selectors.selectAuthToken);
  loading$ = this.store.select(selectors.selectAuthLoading);
  email$ = this.store.select(selectors.selectAuthEmail);

  user$ = this.store.select(selectors.selectAuthUser);
  user: UserData;

  constructor(
    private store: Store<AppState>,
    private companiesFacade: CompaniesFacade,
  ) {
    this.user$.subscribe(user => this.user = user);
    this.isAuthenticated$.subscribe(is => this.isAuthenticated = is);
    // setTimeout(() => this.logout(), 5000);
  }

  loginR(username: string, password: string) {
    this.store.dispatch(actions.authLoginR({ username, password }));
  }

  logout() {
    this.isAuthenticated$.pipe(first()).subscribe(val => {
      if (val)
        this.store.dispatch(actions.authLogout());
      else
        console.warn('AuthFacade > logout: Already logged out');
    });
  }

  fetchUser() {
    const companyId = this.companiesFacade.selectedCompany?.data.id;
    this.store.dispatch(actions.authFetchUserR({ companyId }));
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(take(1), map(user => {
      const companyData = user.selected_user_company.data;
      if (!companyData) return false;

      const role = companyData.role.data.name;
      return role === UserRole.admin || role === UserRole.owner;
    }));
  }

}
