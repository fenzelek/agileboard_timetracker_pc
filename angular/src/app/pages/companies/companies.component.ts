import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NativeService } from 'src/app/services/native.service';
import { OfflineService } from 'src/app/services/offline.service';
import { AuthFacade } from 'src/core/auth/auth.facade';
import { AppState } from 'src/core/core.state';
import { NotificationService } from 'src/core/notifications/notification.service';
import { selectSettings } from 'src/core/settings/settings.selectors';
import { companiesEntitiesR, companiesSetSelected } from 'src/core/store/companies/companies.actions';
import { CompanyEntity } from 'src/core/store/companies/companies.model';
import { selectCompaniesEntities, selectCompaniesLoading } from 'src/core/store/companies/companies.selectors';
import { projectsReset } from 'src/core/store/projects/projects.actions';
import { clone } from 'src/core/store/shared';
import { tasksReset } from 'src/core/store/tasks/tasks.actions';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { ElectronService } from 'src/electronService/electron.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-companies-page',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  uns$ = new Subject<void>();
  loading = false;
  companies: CompanyEntity[] = [];
  isMobile = environment.cordova;
  openCompanyIfOnlyOne: boolean;

  showNoInternet: boolean;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private timeStore: TimeStore,
    private notificationService: NotificationService,
    private authFacade: AuthFacade,
    private cd: ChangeDetectorRef,
    private nativeService: NativeService,
    private offlineService: OfflineService,
    private electronService: ElectronService,
  ) { }

  ngOnInit(): void {
    this.handleTimer();
    this.subscribeLoading();
    this.subscribeSettings();
    this.subscribeCompanies();

    this.subscribeConnection();
    this.subscribeOffline();
    this.checkConnection();

    if (!this.showNoInternet) {
      this.fetchCompanies();
    }

    this.store.dispatch(companiesSetSelected({ id: null }));
    this.store.dispatch(projectsReset());
    this.store.dispatch(tasksReset());
    this.electronService.unselectCompany();
  }

  private handleTimer() {
    if (this.timeStore.isActive) {
      this.timeStore.stop();
      this.notificationService.toaster('info', 'tt.time.stopped', 3500);
    }
  }

  private subscribeLoading() {
    this.store.pipe(
      select(selectCompaniesLoading),
      takeUntil(this.uns$),
    )
      .subscribe(loading => {
        this.loading = loading;
        this.cd.detectChanges();
      });
  }

  private subscribeSettings() {
    this.store.select(selectSettings).pipe(takeUntil(this.uns$)).subscribe(settings => {
      this.openCompanyIfOnlyOne = settings.openCompanyIfOnlyOne;
    });
  }

  private subscribeCompanies() {
    this.store.pipe(
      select(selectCompaniesEntities),
      takeUntil(this.uns$),
    )
    .subscribe(companies => {
      const onlyOneCompany = companies.length === 1;

      if (onlyOneCompany && this.openCompanyIfOnlyOne) {
        setTimeout(() => this.openDashboard(companies[0].data.id), 1);
      } else {
        this.companies = clone(companies);
        this.setLogos();
        this.cd.detectChanges();
      }
    });
  }

  private setLogos() {
    this.authFacade.token$
      .pipe(takeUntil(this.uns$))
      .subscribe(token => {
        this.companies.forEach(company => {
          const url = `${environment.apiUrl}/companies/get-logotype/${company.data.id}?selected_company_id=${company.data.id}&token=${token}`;
          const image = new Image();
          image.src = url;
          image.onload = () => {
            company.data.logoUrl = url
            this.cd.detectChanges();
          };
        });
      });
  }

  private subscribeConnection() {
    this.nativeService.networkOnline$.pipe(takeUntil(this.uns$)).subscribe(online => {
      if (online) {
        this.checkConnection();
      }
    });
  }

  private subscribeOffline() {
    this.timeStore.isOffline$.pipe(takeUntil(this.uns$)).subscribe(() => {
      this.fetchCompanies();
    });
  }

  private fetchCompanies() {
    this.store.dispatch(companiesEntitiesR());
  }

  checkConnection() {
    this.showNoInternet = this.offlineService.shouldShowNoInternet();
    if (!this.showNoInternet && !this.companies.length) {
      this.fetchCompanies();
    }
    this.cd.detectChanges();
  }

  openDashboard(id: number) {
    this.store.dispatch(companiesSetSelected({ id }));
    this.electronService.selectCompany();
    this.router.navigateByUrl(`company/dashboard`);
  }

  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }

}
