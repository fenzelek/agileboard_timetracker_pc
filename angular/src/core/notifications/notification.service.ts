import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BodyOutputType, Toast, ToasterService, ToastType } from 'angular2-toaster';

export interface SnackBarAction {
  name: string;
  event: Function;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly zone: NgZone,
    private readonly translateService: TranslateService,
    private toasterService: ToasterService,
  ) {}

  default(message: string, action?: SnackBarAction) {
    this.show(message, {
      duration: !action ? 2000 : 4000,
      panelClass: 'default-notification-overlay'
    }, action);
  }

  info(message: string, action?: SnackBarAction) {
    this.show(message, {
      duration: !action ? 2000 : 4000,
      panelClass: ['color', 'bg-primary-dark']
    }, action);
  }

  success(message: string, action?: SnackBarAction) {
    this.show(message, {
      duration: !action ? 2000 : 4000,
      panelClass: 'success-notification-overlay'
    }, action);
  }

  warn(message: string, action?: SnackBarAction) {
    this.show(message, {
      duration: !action ? 2500 : 5000,
      panelClass: 'warning-notification-overlay'
    }, action);
  }

  error(message: string, action?: SnackBarAction) {
    this.show(message, {
      duration: !action ? 3000 : 6000,
      panelClass: 'error-notification-overlay'
    }, action);
  }

  show(message: any, configuration: MatSnackBarConfig, action?: SnackBarAction) {
    message = message.message ? message.message : message;
    message = this.translateService.get(message) ? this.translateService.instant(message) : message;

    // Need to open snackBar from Angular zone to prevent issues with its position per
    // https://stackoverflow.com/questions/50101912/snackbar-position-wrong-when-use-errorhandler-in-angular-5-and-material
    this.zone.run(() => this.open(message, action, configuration));
  }

  private open(message: string, action: SnackBarAction, configuration: MatSnackBarConfig) {
    const actionName = action ? this.translateService.instant(action.name) : null;

    const runAction = () => action.event ? action.event() : null;

    this.snackBar
      .open(message, actionName, configuration)
      .onAction().pipe().subscribe(runAction);
  }

  toaster(type: ToastType, message: string, timeout?: number): Toast {
    message = this.translateService.get(message) ? this.translateService.instant(message) : message;

    const toast: Toast = {
      type,
      timeout,
      body: message,
      tapToDismiss: false,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };

    return this.toasterService.pop(toast);
  }

  createToaster(config: Toast) {
    return this.toasterService.pop(config);
  }

}
