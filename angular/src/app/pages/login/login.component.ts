import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthFacade } from '../../../core/auth/auth.facade';
import { filter, takeUntil } from 'rxjs/operators';
import { LocalStorageService } from 'src/core/local-storage/local-storage.service';
import { environment } from 'src/environments/environment';
import { NativeService } from 'src/app/services/native.service';
import { ElectronService } from 'src/electronService/electron.service';
import { Router } from '@angular/router';
import { OfflineService } from 'src/app/services/offline.service';

type LoginData = { email: string, password?: string };

const LOGIN_DATA_KEY = 'login-data';


@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private uns$ = new Subject<void>();
  loading$ = this.authFacade.loading$;

  isMobile = environment.cordova;

  showNoInternet: boolean;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  verifiedInfo = false;

  constructor(
    private fb: FormBuilder,
    private authFacade: AuthFacade,
    private lsService: LocalStorageService,
    private nativeService: NativeService,
    private offlineService: OfflineService,
    private electronService: ElectronService,
    private cd: ChangeDetectorRef,
    private rourer: Router,
    private zone: NgZone,
  ) { }

  ngOnInit(): void {
    this.goToCompanySelectIfLoggedIn();
    this.ifElectron(this.fillLoginForm);
    this.subscribeConnection();
    this.checkConnection();
  }

  private ifElectron(cb: Function, ...args: any) {
    if (environment.electron) cb.call(this, ...args);
  }

  private goToCompanySelectIfLoggedIn() {
    this.authFacade.isAuthenticated$
      .pipe(takeUntil(this.uns$), filter(is => is))
      .subscribe(() => {
        this.rourer.navigateByUrl('company/select');
      });
  }

  private fillLoginForm() {
    this.zone.run(() => {
      const data: LoginData = this.lsService.getItem(LOGIN_DATA_KEY);
      if (!data) return;
  
      this.electronService.getPassword(data.email)
        .pipe(takeUntil(this.uns$))
        .subscribe(password => {
          data.password = password;
          this.form.setValue(data);
          this.cd.detectChanges();
        });
    });
  }

  private saveLoginData() {
    const data: LoginData = {
      email: this.form.value.email,
    };
    const password = this.form.value.password;

    this.electronService.setPassword(data.email, password);
    this.lsService.setItem(LOGIN_DATA_KEY, data);
  }

  private subscribeConnection() {
    this.nativeService.networkOnline$.pipe(takeUntil(this.uns$)).subscribe(online => {
      this.checkConnection();
      if (online) {
        this.ifElectron(this.fillLoginForm);
      }
    });
  }

  checkConnection() {
    this.zone.run(() => {
      this.showNoInternet = this.offlineService.shouldShowNoInternet();
      this.cd.detectChanges();
    });
  }

  login() {
    const { email, password } = this.form.value;
    this.ifElectron(this.saveLoginData);
    this.authFacade.loginR(email, password);
  }

  openRegisterPage() {
    const url = `${environment.abUrl}/guest/register`;
    this.nativeService.openUrl(url);
  }

  openForgotPasswordPage() {
    const url = `${environment.abUrl}/guest/forgot-password`;
    this.nativeService.openUrl(url);
  }

  ngOnDestroy(): void {
    this.uns$.next();
    this.uns$.complete();
  }

}
