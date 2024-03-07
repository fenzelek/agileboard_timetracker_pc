import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/core/core.state';
import { CompanyEntity } from 'src/core/store/companies/companies.model';
import { selectCompaniesSelected } from 'src/core/store/companies/companies.selectors';
import { Time } from 'src/core/timeStore/model';
import { TimeStore } from 'src/core/timeStore/timeStore';


@Component({
  selector: 'app-working-company-box',
  templateUrl: './working-company-box.component.html',
  styleUrls: ['./working-company-box.component.scss']
})
export class WorkingCompanyBoxComponent implements OnInit, OnDestroy {
  uns$ = new Subject<void>();

  company: CompanyEntity;
  companyTime: Time;

  @Input() isMobile: Boolean;

  constructor(
    private timeStore: TimeStore,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.subscribeCompany();
  }

  private subscribeCompany() {
    this.store
      .pipe(select(selectCompaniesSelected), takeUntil(this.uns$))
      .subscribe(company => {
        this.company = company;
        this.subscribeTime();
      });
  }

  private subscribeTime() {
    if (!this.company) return;

    const companyIdKey = `${this.company.data.id}`;

    this.timeStore.companies.onChange(companyIdKey)
      .pipe(takeUntil(this.uns$))
      .subscribe(time => this.companyTime = time);
  }

  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }

}
