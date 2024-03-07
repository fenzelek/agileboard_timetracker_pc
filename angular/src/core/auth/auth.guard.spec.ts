import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { AppState } from '../core.state';
import { AuthFacade } from './auth.facade';

import { AuthGuard } from './auth.guard';
import { AuthState } from './auth.models';
import { selectIsAuthenticated } from './auth.selectors';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, AuthFacade, provideMockStore()]
    });
    authGuard = TestBed.inject<AuthGuard>(AuthGuard);
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectIsAuthenticated, true);
  });

  /**
   * @Feature Auth
   * @Scenario Auth Guard
   * @Case should be created
   *
   * @test
   */
  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  /**
   * @Feature Auth
   * @Scenario Auth Guard
   * @Case should return isAuthenticated from authState
   *
   * @test
   */
  it('should return isAuthenticated from authState', () => {
    authGuard.canActivate().subscribe(canActivate => {
      expect(canActivate).toBe(true);
    });
  });
});

function createState(authState: AuthState) {
  return {
    auth: authState
  } as AppState;
}
