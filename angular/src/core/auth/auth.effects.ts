import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';

import {LocalStorageService} from '../local-storage/local-storage.service';
import {
  authFetchUserR,
  authFetchUserS,
  authFetchUserF,
  authLoginR,
  authLoginS,
  authLoginF,
  authLogout,
} from './auth.actions';
import { NotificationService } from '../notifications/notification.service';
import { TimeStore } from '../timeStore/timeStore';
import { UserData } from '../store/projects/projects.model';
import { Store } from '@ngrx/store';
import { selectAuthState } from './auth.selectors';
import { AppState } from '../core.state';
import { AUTH_KEY } from './auth.models';
import { CompaniesFacade } from '../store/companies/companies.facade';
import { AuthFacade } from './auth.facade';
import { OfflineService } from 'src/app/services/offline.service';
import { DesktopNotificationService } from 'src/app/services/desktop-notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from 'src/electronService/electron.service';


@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private timeStore: TimeStore,
    private offlineService: OfflineService,
    private store: Store<AppState>,
    private authFacade: AuthFacade,
    private desktopNotificationService: DesktopNotificationService,
    private electronService: ElectronService,
  ) { }


  persistAuth = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          authLoginR,
          authLoginS,
          authLoginF,
          authLogout,
          authFetchUserS,
          authFetchUserF,
        ),
        withLatestFrom(this.store.select(selectAuthState)),
        tap(([action, auth]) =>
          this.localStorageService.setItem(AUTH_KEY, auth)
        )
      ),
    { dispatch: false }
  );

  loginR = createEffect(() =>
    this.actions$.pipe(
      ofType(authLoginR),
      switchMap(data =>
        this.http.post('/auth', { email: data.username, password: data.password }).pipe(
          map((res: any) => authLoginS({ token: res.data.token })),
          catchError((resp: HttpErrorResponse) => {
            if (resp.status === 403 && resp.error.code === 'auth.user_already_logged')
              return of(authLoginS({ token: this.localStorageService.getItem(AUTH_KEY).token }));
            else
              return of(authLoginF({ error: resp }));
          })
        )
      )
    ),
    {dispatch: true}
  );

  loginS = createEffect(() =>
    this.actions$.pipe(
      ofType(authLoginS),
      tap(() => {
        this.timeStore.reset();
        this.authFacade.fetchUser();
        this.router.navigateByUrl('/company/select');
      }),
    ),
    {dispatch: false}
  );

  fetchUserR = createEffect(() =>
    this.actions$.pipe(
      ofType(authFetchUserR),
      switchMap(({ companyId }) => {
        let url = `/users/current`;

        if (companyId) {
          url += `?selected_company_id=${companyId}`;
        }

        return this.http.get<{ data: UserData }>(url).pipe(
          map(resp => authFetchUserS({ user: resp.data })),
          catchError((resp: HttpErrorResponse) => of(authFetchUserF({ error: resp })))
        )
      }),
    ),
    {dispatch: true}
  );

  logout = createEffect(() =>
    this.actions$.pipe(
      ofType(authLogout),
      tap(() => this.router.navigateByUrl('/login')),
      tap(() => this.timeStore.stop()),
      tap(() => this.offlineService.cache.reset()),

      switchMap(() =>
        this.http.delete('/auth',{}).pipe(
          map(() => authLoginF({ error: '' })),
          catchError((resp: HttpResponse<any>) => of(authLoginF({ error: resp }))),
          tap(() => {
            if (document.visibilityState === 'hidden') {
              this.desktopNotificationService.show('tt.notify.logged-out', { requireInteraction: true }).subscribe();
              this.electronService.focusApp();
            }
          }),
        )
      )
    ),
    {dispatch: true}
  );

}
