import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { actionSettingsChangeLanguage, actionSettingsChangeTheme } from "../../../../core/settings/settings.actions";
import { authLogout } from "../../../../core/auth/auth.actions";
import { environment } from "../../../../environments/environment";
import { AppState } from "../../../../core/core.state";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { selectSettingsLanguage, selectTheme } from "../../../../core/settings/settings.selectors";
import { Theme } from 'src/core/settings/settings.model';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { TimeStore } from 'src/core/timeStore/timeStore';
import { AuthFacade } from 'src/core/auth/auth.facade';
import { UserData } from 'src/core/store/projects/projects.model';
import { LocalStorageService } from 'src/core/local-storage/local-storage.service';
import { selectIsAuthenticated } from 'src/core/auth/auth.selectors';
import { DesktopContentService, DesktopContentView } from 'src/app/services/desktop-content.service';
import { CompaniesFacade } from 'src/core/store/companies/companies.facade';
import { CompanyEntity } from 'src/core/store/companies/companies.model';
import { ElectronService } from 'src/electronService/electron.service';


@Component({
  selector: 'app-desktop-toolbar',
  templateUrl: './desktop-toolbar.component.html',
  styleUrls: ['./desktop-toolbar.component.scss']
})
export class DesktopToolbarComponent implements OnInit {
  uns$ = new Subject<void>();

  production = environment.production;

  languages = ['en', 'pl', 'ru', 'ua'];
  themes = [
    { value: Theme.default, label: 'default' },
    { value: Theme.dark, label: 'dark' }
  ];
  theme: Theme;

  currentUser: UserData;
  language$: Observable<string>;
  isAuthenticated$: Observable<boolean>;
  synchronizing$: Observable<boolean>;
  isOffline$: Observable<boolean>;
  isSynchronized$: Observable<boolean>;
  selectedCompany$: Observable<CompanyEntity>;
  lastSync: number;

  @Input() showLogo = true;


  constructor(
    protected authFacade: AuthFacade,
    protected store: Store<AppState>,
    protected cd: ChangeDetectorRef,
    protected ls: LocalStorageService,
    protected companiesFacade: CompaniesFacade,
    protected desktopContentService: DesktopContentService,
    protected electronService: ElectronService,
    public timeStore: TimeStore,
  ) { }

  ngOnInit(): void {
    this.subscribeSync();
    this.subscribeCurrentUser();
    this.selectedCompany$ = this.companiesFacade.selectedCompany$;
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.isOffline$ = this.timeStore.isOffline$;
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.store.pipe(select(selectTheme), takeUntil(this.uns$)).subscribe(theme => this.theme = theme);
  }
  
  private subscribeSync() {
    this.synchronizing$ = this.timeStore.synchronizing$;
    this.isSynchronized$ = this.timeStore.isSynchronized$;
    this.timeStore.lastSync$.pipe(takeUntil(this.uns$)).subscribe(lastSync => { this.lastSync = lastSync; this.cd.detectChanges() });
  }

  private subscribeCurrentUser() {
    this.authFacade.user$.pipe(takeUntil(this.uns$), withLatestFrom(this.authFacade.token$))
    .subscribe(([user, token]) => {
      if (user) {
        this.currentUser = user;
        this.getAvatar(token);
        this.cd.detectChanges();
      }
    });
  }

  private getAvatar(token: string) {
    if (!this.currentUser.avatar) return;

    const url = `${environment.apiUrl}/users/avatar/${this.currentUser?.avatar}?token=${token}`;
    const image = new Image();
    image.src = url;
    image.onload = () => this.currentUser.avatarUrl = url;
  }

  getUserName() {
    return this.currentUser
      ? this.currentUser.first_name + ' ' + this.currentUser.last_name
      : '';
  }

  onLogoutClick() {
    this.store.dispatch(authLogout());
    this.electronService.logout();
  }

  onLanguageSelect({ value: language }: any) {
    this.store.dispatch(actionSettingsChangeLanguage({ language }));
  }

  onThemeSelect(theme: Theme) {
    this.store.dispatch(actionSettingsChangeTheme({ theme }));
  }

  syncTime() {
    this.timeStore.sync();
  }

  openRegisteredTimes() {
    this.desktopContentService.open(DesktopContentView.REGISTERED_TIMES);
  }

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  ngOnDestroy() {
    this.uns$.next();
    this.uns$.complete();
  }

  // getLanguageFlag(language: String): String {
  //   if (environment.electron) {
  //     let path = this.electronService.takePath();
  //     let result = path + '\\app\\assets\\flags\\'+ language.toLowerCase()+'.png'
  //     console.log(result)
  //     return result
  //   } else {
  //     return '/assets/flags/'+ language.toLowerCase()+'.png'
  //   }
  // }
}
