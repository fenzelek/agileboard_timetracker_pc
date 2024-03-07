import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { interval, Observable, Subject } from 'rxjs';
import { selectEffectiveTheme } from 'src/core/settings/settings.selectors';
import { environment } from '../environments/environment';
import { AppState } from 'src/core/core.state';
import { Theme } from 'src/core/settings/settings.model';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { AuthFacade } from 'src/core/auth/auth.facade';
import { DataService } from './services/data.service';
import { NativeService } from './services/native.service';
import { OfflineService } from './services/offline.service';
import { DesktopNotificationService } from './services/desktop-notifications.service';
import { ElectronService } from 'src/electronService/electron.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private uns$ = new Subject<void>();

  theme$: Observable<Theme>;
  isAuthenticated$: Observable<boolean>;

  public environment = environment;

  constructor(
    private store: Store<AppState>,
    private timeStore: TimeStore,
    private authFacade: AuthFacade,
    private dataService: DataService,
    private nativeService: NativeService,
    private offlineService: OfflineService,
    private desktopNotificationService: DesktopNotificationService,
    private electronService: ElectronService,
  ) { }

  ngOnInit(): void {
    this.theme$ = this.store.pipe(select(selectEffectiveTheme), takeUntil(this.uns$));
    this.isAuthenticated$ = this.authFacade.isAuthenticated$.pipe(takeUntil(this.uns$));

    this.setDataAutoRefresh();
    this.subscribeServerTimes();
    this.fetchUser();
    this.initCache();
    this.notifyWhenNotRegisteringTime();
    this.saveTimeBeforeAppClose();
  }

  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }

  private initCache() {
    this.authFacade.user$.pipe(
      takeUntil(this.uns$),
      filter(user => !!user),
    )
    .subscribe(user => {
      this.offlineService.cache.init(user.id);
    });
  }

  private notifyWhenNotRegisteringTime() {
    let timeout: number;

    const startTimeout = () => {
      timeout = window.setTimeout(() => {
        notify();
        startTimeout();
      }, environment.notRegisteringTimeWarningTimeout);
    }

    const stopTimeout = () => {
      window.clearTimeout(timeout);
      timeout = null;
    }

    const notify = () => this.desktopNotificationService.show('tt.notify.not-registering-time').subscribe();

    this.timeStore.isActive$.subscribe(isActive => {
      if (isActive) {
        stopTimeout();
      } else if (this.authFacade.isAuthenticated && !timeout) {
        startTimeout();
      }
    });

    this.authFacade.isAuthenticated$.subscribe(is => {
      if (is && !timeout) {
        startTimeout();
      }
      if (!is) {
        stopTimeout();
      }
    });
  }

  private setDataAutoRefresh() {
    interval(environment.dataRefreshTime).pipe(
      takeUntil(this.uns$),
      filter(() => !this.timeStore.isOffline),
    )
    .subscribe(() => this.dataService.reloadData());
  }

  private subscribeServerTimes() {
    this.fetchTimesWhenLoggedIn();
    this.fetchTimesPeriodically();
    this.fetchTimesAfterOfflineModeSwitchOff();
    this.fetchTimesAfterConnnectedToInternet();
  }

  private fetchTimesWhenLoggedIn() {
    this.isAuthenticated$.pipe(
      takeUntil(this.uns$),
      filter(is => is),
      filter(() => !this.timeStore.isOffline), // online mode
    )
    .subscribe(() => {
      const isSynced = this.timeStore.getIsSynchronized();

      if (isSynced)
        this.timeStore.fetch();
      else
        this.timeStore.sync();
    });
  }

  private fetchTimesPeriodically() {
    interval(environment.dataRefreshTime).pipe(
      takeUntil(this.uns$),
      withLatestFrom(
        this.isAuthenticated$,
        (_, authenticated) => ({ authenticated })
      )
    )
    .subscribe(({ authenticated }) => {
      if (
        authenticated && 
        !this.timeStore.isOffline && 
        !this.timeStore.isActive && 
        this.moreThanMinuteSinceLastFetch()
      ) {
        this.timeStore.fetch();
      }
    });
  }

  private fetchTimesAfterOfflineModeSwitchOff() {
    this.timeStore.isOffline$.pipe(
      takeUntil(this.uns$),
      filter(offline => !offline),
      filter(() => this.nativeService.networkOnline),
      withLatestFrom(
        this.isAuthenticated$,
        (_, authenticated) => ({ authenticated })
      )
    )
    .subscribe(({ authenticated }) => {
      if (authenticated && this.moreThanMinuteSinceLastFetch()) {
        this.timeStore.fetch();
      }
    });
  }

  private fetchTimesAfterConnnectedToInternet() {
    this.nativeService.networkOnline$.pipe(
      takeUntil(this.uns$),
      filter(online => online),
      filter(() => !this.timeStore.isOffline),
      withLatestFrom(
        this.isAuthenticated$,
        (_, authenticated) => ({ authenticated })
      )
    )
    .subscribe(({ authenticated }) => {
      if (authenticated && this.moreThanMinuteSinceLastFetch()) {
        this.timeStore.fetch();
      }
    });
  }

  private moreThanMinuteSinceLastFetch(): boolean {
    const lastSyncTimeAgo = Date.now() - (this.timeStore.lastSync || 0);
    const minute = 1 * 60 * 1000;
    return lastSyncTimeAgo > minute;
  }

  // on app start; fetch user if logged in and not in offline mode
  private fetchUser() {
    this.isAuthenticated$.pipe(take(1)).subscribe(is => {
      if (is && !this.timeStore.isOffline)
        this.authFacade.fetchUser();
    });
  }

  saveTimeBeforeAppClose() {
    this.electronService.onAppClosing().subscribe(() => {
      const isOffline = this.timeStore.isOffline;
      this.timeStore.setOffline(true);
      
      this.timeStore.stop(() => {
        this.timeStore.setOffline(isOffline);
        this.electronService.closeApp();
      });
    });
  }

}
