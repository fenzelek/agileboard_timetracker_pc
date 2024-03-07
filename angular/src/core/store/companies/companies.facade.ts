import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/core/core.state";
import { CompanyEntity } from "./companies.model";
import { selectCompaniesSelected } from "./companies.selectors";

@Injectable({
  providedIn: 'root'
})
export class CompaniesFacade {
  
  selectedCompany$ = this.store.select(selectCompaniesSelected);
  selectedCompany: CompanyEntity;

  constructor(private store: Store<AppState>) {
    this.selectedCompany$.subscribe(company => this.selectedCompany = company);
  }

}
