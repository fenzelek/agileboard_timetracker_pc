import * as assert from 'assert';
import { Router } from '@angular/router';
import { Actions, getEffectsMetadata } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { authLogout, authLoginS } from './auth.actions';
import { AuthEffects, AUTH_KEY } from './auth.effects';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '@app/core/notifications/notification.service';
import { AuthFacade } from './auth.facade';

const scheduler = new TestScheduler((actual, expected) =>
  assert.deepStrictEqual(actual, expected)
);

describe('AuthEffects', () => {
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let authFacade: jasmine.SpyObj<AuthFacade>;
  let router: jasmine.SpyObj<Router>;
  let http: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    localStorageService = jasmine.createSpyObj('LocalStorageService', [
      'setItem'
    ]);
    authFacade = jasmine.createSpyObj('AuthFacade', ['email$']);
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'pipe']);
  });

  describe('loginS', () => {
    /**
     * @Feature Auth
     * @Scenario Login Success
     * @Case should not dispatch any action
     *
     * @test
     */
    it('should not dispatch any action', () => {
      const actions = new Actions(EMPTY);
      const notificationService = new NotificationService(null, null, null);
      const effect = new AuthEffects(
        actions,
        router,
        http,
        localStorageService,
        notificationService,
        authFacade
      );
      const metadata = getEffectsMetadata(effect);

      expect(metadata.loginS.dispatch).toEqual(false);
    });

    /**
     * @Feature Auth
     * @Scenario Login Success
     * @Case should call setItem on LocalStorageService
     *
     * @test
     */
    it('should call setItem on LocalStorageService', () => {
      scheduler.run(helpers => {
        const token = 'token123';
        const { cold } = helpers;
        const loginAction = authLoginS({ token });
        const source = cold('a', { a: loginAction });
        const actions = new Actions(source);
        const notificationService = new NotificationService(null, null, null);
        const effect = new AuthEffects(
          actions,
          router,
          http,
          localStorageService,
          notificationService,
          authFacade
        );

        effect.loginS.subscribe(() => {
          expect(localStorageService.setItem).toHaveBeenCalledWith(AUTH_KEY, {
            isAuthenticated: true,
            token
          });
        });
      });
    });
  });

  describe('logout', () => {
    /**
     * @Feature Auth
     * @Scenario Logout
     * @Case should dispatch LoginF action
     *
     * @test
     */
    it('should dispatch LoginF action', () => {
      const actions = new Actions(EMPTY);
      const notificationService = new NotificationService(null, null, null);
      const effect = new AuthEffects(
        actions,
        router,
        http,
        localStorageService,
        notificationService,
        authFacade
      );
      const metadata = getEffectsMetadata(effect);

      expect(metadata.logout.dispatch).toEqual(true);
    });

    /**
     * @Feature Auth
     * @Scenario Logout
     * @Case should call setItem on LocalStorageService and navigate to about
     *
     * @test
     */
    it('should call setItem on LocalStorageService and navigate to about', () => {
      scheduler.run(helpers => {
        const { cold } = helpers;
        const logoutAction = authLogout();
        const source = cold('a', { a: logoutAction });
        const actions = new Actions(source);
        const notificationService = new NotificationService(null, null, null);
        const effect = new AuthEffects(
          actions,
          router,
          http,
          localStorageService,
          notificationService,
          authFacade
        );

        effect.logout.subscribe(() => {
          expect(localStorageService.setItem).toHaveBeenCalledWith(AUTH_KEY, {
            isAuthenticated: false,
            token: null
          });
          expect(router.navigate).toHaveBeenCalledWith(['']);
        });
      });
    });
  });
});
