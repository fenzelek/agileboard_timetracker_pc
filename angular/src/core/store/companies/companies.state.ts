import { CompanyEntity } from './companies.model';

export interface CompaniesState {
  list: CompanyEntity[];
  loading: boolean;
  selectedId: number;
}
