import { createAction, props } from '@ngrx/store';
import { Company } from './companies.model';


// get all companies
export const companiesEntitiesR = createAction('[Companies] Entities - Request');

export const companiesEntitiesS = createAction(
  '[Companies] Entities - fetch Success',
  props<{ data: Company[] }>()
);

export const companiesEntitiesF = createAction(
  '[Companies] Entities - fetch Fail',
  props<{ error: any }>()
);

// setters
export const companiesSetSelected = createAction(
  '[Companies] Set selected id',
  props<{ id: number }>()
);
