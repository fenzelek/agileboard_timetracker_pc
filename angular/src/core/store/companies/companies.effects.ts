import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as a from './companies.actions';
import { OfflineService } from 'src/app/services/offline.service';
import { Company } from './companies.model';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { authFetchUserR } from 'src/core/auth/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/core/core.state';

const companiesUrl = '/users/current/companies';


@Injectable()
export class CompaniesEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private offlineService: OfflineService,
    private timeStore: TimeStore,
    private store: Store<AppState>,
  ) { }

  entitiesR = createEffect(
    () =>
      this.actions$.pipe(
        ofType(a.companiesEntitiesR),
        switchMap(() => {

          if (this.timeStore.isOffline) {
            return this.offlineService.cache.getCompanies().pipe(
              map(companies => a.companiesEntitiesS({ data: companies }))
            );
          }

          return this.http.get<{ data: Company[] }>(companiesUrl).pipe(
            tap(res => {
              this.offlineService.cache.setCompanies(res.data);
            }),
            map((res: any) => a.companiesEntitiesS({ data: res.data })),
            catchError((error: HttpResponse<any>) =>
              of(a.companiesEntitiesF({ error }))
            )
          )

        })
      ),
    { dispatch: true }
  );

  companySelected = createEffect(() => 
    this.actions$.pipe(
      ofType(a.companiesSetSelected),
      tap(({ id }) => {
        if (!this.timeStore.isOffline) {
          this.store.dispatch(authFetchUserR({ companyId: id }));
        }
      })
    ),
  { dispatch: false });

}
