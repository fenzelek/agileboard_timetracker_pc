import { authReducer, initialState } from './auth.reducer';
import { AuthState } from './auth.models';
import { authLoginF, authLoginS, authLogout } from './auth.actions';

describe('AuthReducer', () => {
  const TEST_INITIAL_STATE: AuthState = {
    isAuthenticated: false,
    token: null,
    email: null,
    loading: false,
    user: null,
  };

  /**
   * @Feature Auth
   * @Scenario Auth Reducer
   * @Case should return default state
   *
   * @test
   */
  it('should return default state', () => {
    const action = {} as any;
    const state = authReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  /**
   * @Feature Auth
   * @Scenario Auth Reducer
   * @Case should set authentication to true on login success
   *
   * @test
   */
  it('should set authentication to true on login success', () => {
    const action = authLoginS({ token: 'token123', username: '' });
    const state = authReducer(TEST_INITIAL_STATE, action);

    expect(state.isAuthenticated).toBe(true);
  });

  /**
   * @Feature Auth
   * @Scenario Auth Reducer
   * @Case should set authentication to false on login failure
   *
   * @test
   */
  it('should set authentication to false on login failure', () => {
    const action = authLoginF({ error: 'error' });
    const state = authReducer(TEST_INITIAL_STATE, action);

    expect(state.isAuthenticated).toBe(false);
  });

  /**
   * @Feature Auth
   * @Scenario Auth Reducer
   * @Case should set token on login success
   *
   * @test
   */
  it('should set token on login success', () => {
    const action = authLoginS({ token: 'token123', username: '' });
    const state = authReducer(TEST_INITIAL_STATE, action);

    expect(state.token).toBe('token123');
  });

  /**
   * @Feature Auth
   * @Scenario Auth Reducer
   * @Case should set token to null on login failure
   *
   * @test
   */
  it('should set token to null on login failure', () => {
    const action = authLoginF({ error: 'error' });
    const state = authReducer(TEST_INITIAL_STATE, action);

    expect(state.token).toBe(null);
  });

  /**
   * @Feature Auth
   * @Scenario Auth Reducer
   * @Case should set authentication to false on logout
   *
   * @test
   */
  it('should set authentication to false on logout', () => {
    const action = authLogout();
    const state = authReducer(TEST_INITIAL_STATE, action);

    expect(state.isAuthenticated).toBe(false);
  });

  /**
   * @Feature Auth
   * @Scenario Auth Reducer
   * @Case should set token to null on logout
   *
   * @test
   */
  it('should set token to null on logout', () => {
    const action = authLogout();
    const state = authReducer(TEST_INITIAL_STATE, action);

    expect(state.token).toBe(null);
  });
});
