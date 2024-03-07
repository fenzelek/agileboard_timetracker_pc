import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { map, withLatestFrom } from 'rxjs/operators';
import { AppState } from '../core.state';
import { selectUrl } from '../router/router.selectors';
import { selectCompaniesSelectedId } from '../store/companies/companies.selectors';


@Injectable({
  providedIn: 'root'
})
export class StateGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) { }

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(selectUrl),
      withLatestFrom(this.store.pipe(select(selectCompaniesSelectedId))),

      map(([route, companyId]) => {
        console.log('route', route);

        // check data for dashboard
        if (route.match('/dashboard')) {
          const dataOk = !!companyId;
          if (!dataOk)
            this.router.navigateByUrl('company/select');
          return dataOk;
        }

        return true;
      }),
    );
  }

}
