import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import * as a from './stats.actions';


@Injectable()
export class StatsEffects {
  constructor(
    private actions$: Actions,
  ) {}

}
