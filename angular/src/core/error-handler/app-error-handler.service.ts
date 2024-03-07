import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NotificationService } from '../notifications/notification.service';
import { environment } from '../../environments/environment';


/**
 * Application-wide error handler that adds a UI notification to the error handling
 * provided by the default Angular ErrorHandler.
 */
@Injectable()
export class AppErrorHandler extends ErrorHandler {
  constructor(
    private notificationsService: NotificationService,
  ) {
    super();
  }

  handleError(error: Error | HttpErrorResponse) {
    let message: string;


    // Http error
    if (error instanceof HttpErrorResponse) {
      // implementation moved to http-error.interceptor
      // message = error.error.message || 'dtm.errors.api-error';
      // action = this.getActionData(error.error.action);
    } else {
      // App error
      if (!environment.production) {
        console.error(error)
        message = 'tt.errors.error-occurred';
        this.notificationsService.error(message);
      }
    }

    super.handleError(error);
  }
}
