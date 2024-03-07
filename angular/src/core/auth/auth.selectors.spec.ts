import { AppState } from '../core.state';
import {
  selectAuth,
  selectAuthToken,
  selectIsAuthenticated,
  selectAuthLoading
} from './auth.selectors';

describe('Auth Selectors', () => {
  /**
   * @Feature Auth
   * @Scenario Auth Selector
   * @Case selectAuth
   *
   * @test
   */
  it('selectAuth', () => {
    const state = createAuthState();
    expect(selectAuth(state)).toBe(state.auth);
  });

  /**
   * @Feature Auth
   * @Scenario Auth Selector
   * @Case selectIsAuthenticated
   *
   * @test
   */
  it('selectIsAuthenticated', () => {
    const state = createAuthState();
    expect(selectIsAuthenticated(state)).toBe(false);
  });

  /**
   * @Feature Auth
   * @Scenario Auth Selector
   * @Case selectAuthToken
   *
   * @test
   */
  it('selectAuthToken', () => {
    const state = createAuthState();
    expect(selectAuthToken(state)).toBe(null);
  });

  /**
   * @Feature Auth
   * @Scenario Auth Selector
   * @Case selectAuthLoading
   *
   * @test
   */
  it('selectAuthLoading', () => {
    const state = createAuthState();
    expect(selectAuthLoading(state)).toBe(false);
  });
});

function createAuthState() {
  return {
    auth: {
      isAuthenticated: false,
      token: null,
      loading: false,
      user: null,
    },
  } as AppState;
}
