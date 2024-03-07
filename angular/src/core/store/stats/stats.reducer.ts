import { Action, createReducer, on } from '@ngrx/store';
import { StatsState } from './stats.state';


export const initialState: StatsState = {

}

const reducer = createReducer(initialState,

);

export function statsReducer(state: StatsState | undefined, action: Action): StatsState {
  return reducer(state, action);
}
