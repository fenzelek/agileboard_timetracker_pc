import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from 'src/core/core.state';
import { StatsState } from './stats.state';


export const selectStatsState = createFeatureSelector<AppState, StatsState>(
  'stats'
);
