import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsState } from '../../../core/settings/settings.model';
import { Observable, Subject } from 'rxjs';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/animations/route.animations';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { selectSettings } from '../../../core/settings/settings.selectors';
import {
  actionSettingsChangeLanguage,
  actionSettingsChangeOpenCompanyIfOnlyOne,
  actionSettingsChangeTheme
} from '../../../core/settings/settings.actions';
import { AppState } from 'src/core/core.state';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSelectChange } from '@angular/material/select';
import { OfflineService } from 'src/app/services/offline.service';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/core/notifications/notification.service';
import { NavHandlerConfig, NavigationService } from 'src/app/services/navigation.service';
import { StorageUsageInfo } from 'src/app/services/cache/cache';


@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {
  private uns$ = new Subject<void>();

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  settings$: Observable<SettingsState>;
  isMobile = environment.cordova;

  themes = this.isMobile
  ? [ { value: 'default-theme', label: 'default' } ]
  : [
    { value: 'default-theme', label: 'default' },
    { value: 'dark-theme', label: 'dark' }
  ];

  languages = [
    { value: 'en', label: 'en' },
    { value: 'pl', label: 'pl' },
    { value: 'ru', label: 'ru' },
    { value: 'ua', label: 'ua' }
  ];

  navHandlerConfig: NavHandlerConfig;
  dbUsage: string;
  dbQuota: string;

  constructor(
    private store: Store<AppState>,
    private offlineService: OfflineService,
    private notificationService: NotificationService,
    private navigationService: NavigationService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.settings$ = this.store.pipe(select(selectSettings));
    this.navHandlerConfig = this.navigationService.addBackButtonHandler(() => this.navigationService.back());
    this.checkDbUsage();
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
    this.navHandlerConfig.removeHandler();
  }

  private checkDbUsage() {
    this.offlineService.cache.getStorageUsageInfo().subscribe(info => {
      const bytesToMegabytes = 1000 * 1000;  // bytes => KB => MB
      const dbUsage = (info.usageDetails.indexedDB / bytesToMegabytes).toFixed(1);
      const dbQuota = (info.quota / bytesToMegabytes).toFixed(1);
      this.dbUsage = `${dbUsage} MB`;
      this.dbQuota = `${dbQuota} MB`;
      this.cd.detectChanges();
    });
  }

  close(event?: KeyboardEvent) {
    if (event && event.which !== 27) return; // keypress which is not esc
    this.navigationService.back();
  }

  onLanguageSelect({ value: language }: MatSelectChange) {
    this.store.dispatch(actionSettingsChangeLanguage({ language }));
  }

  onThemeSelect({ value: theme }: MatSelectChange) {
    this.store.dispatch(actionSettingsChangeTheme({ theme }));
  }

  onOpenCompanyIfOnlyOneChange(ev: MatSlideToggleChange) {
    this.store.dispatch(actionSettingsChangeOpenCompanyIfOnlyOne({ openCompanyIfOnlyOne: ev.checked }));
  }

  clearCache() {
    this.offlineService.cache.clear().pipe(takeUntil(this.uns$)).subscribe(() => {
      this.notificationService.toaster('success', 'tt.info.cache-cleared');
      this.checkDbUsage();
    }, () => {
      this.notificationService.toaster('error', 'tt.errors.error-occurred');
      this.checkDbUsage();
    });
  }

}
