import { authLogout, authLoginS, authLoginR, authLoginF } from './auth.actions';

describe('Auth Actions', () => {
  /**
   * @Feature Auth
   * @Scenario State Actions
   * @Case should create authLoginR action
   *
   * @test
   */
  it('should create authLoginR action', () => {
    const username = 'test@test.com';
    const password = 'password123';
    const action = authLoginR({ username, password });
    expect(action.type).toEqual('[Auth] Login r');
    expect(action.username).toEqual(username);
    expect(action.password).toEqual(password);
  });

  /**
   * @Feature Auth
   * @Scenario State Actions
   * @Case should create authLoginS action
   *
   * @test
   */
  it('should create authLoginS action', () => {
    const token = 'token123';
    const action = authLoginS({ token, username: '' });
    expect(action.type).toEqual('[Auth] Login s');
    expect(action.token).toEqual(token);
  });

  /**
   * @Feature Auth
   * @Scenario State Actions
   * @Case should create authLoginF action
   *
   * @test
   */
  it('should create authLoginF action', () => {
    const error = { message: 'error123' };
    const action = authLoginF({ error });
    expect(action.type).toEqual('[Auth] Login f');
    expect(action.error).toEqual(error);
  });

  /**
   * @Feature Auth
   * @Scenario State Actions
   * @Case should create ActionAuthLogout action
   *
   * @test
   */
  it('should create ActionAuthLogout action', () => {
    const action = authLogout();
    expect(action.type).toEqual('[Auth] Logout');
  });
});
